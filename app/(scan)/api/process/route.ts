import { NextRequest } from "next/server"
import { LingoDotDevEngine } from "lingo.dev/sdk"
import { loadTerms, matchTerms } from "@/app/(scan)/actions"
import { PageMeta, WordToken } from "@/lib/types"

const lingo = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY!,
})

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { extractedText, pages, words, total } = body

    if (!extractedText || !pages || !words) {
        return new Response(JSON.stringify({ error: "Missing extractedText, pages, or words" }), { status: 400 })
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            function send(event: string, data: unknown) {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ event, data })}\n\n`)
                )
            }

            try {
                // Step 0 — Load terms
                send("step", { step: 0 })
                const terms = await loadTerms()

                // Step 1 — Match terms
                send("step", { step: 1 })
                const matches = matchTerms(extractedText, pages, words, terms)

                // Step 2 — Translate
                send("step", { step: 2 })
                const reference_es: Record<string, string> = {}
                const reference_de: Record<string, string> = {}

                for (const match of matches) {
                    if (match.translation_es) reference_es[match.matchedPhrase] = match.translation_es
                    if (match.translation_de) reference_de[match.matchedPhrase] = match.translation_de
                }

                const chunks = extractedText
                    .split(/(?<=[.!?])\s+(?=[A-Z])|(?=\d+\.\s+[A-Z])/)
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 10)
                    .reduce((acc: Record<string, string>, chunk: string, i: number) => {
                        acc[`p${i}`] = chunk
                        return acc
                    }, {} as Record<string, string>)

                const [translated_es_obj, translated_de_obj] = await Promise.all([
                    lingo.localizeObject(chunks, {
                        sourceLocale: "en",
                        targetLocale: "es",
                        reference: { en: reference_es },
                    }),
                    lingo.localizeObject(chunks, {
                        sourceLocale: "en",
                        targetLocale: "de",
                        reference: { en: reference_de },
                    }),
                ])

                const translated_es = Object.values(translated_es_obj).join("\n")
                const translated_de = Object.values(translated_de_obj).join("\n")

                // Step 3 — Finalizing
                send("step", { step: 3 })

                const paragraphMap = Object.keys(chunks).map((key, i) => ({
                    index: i,
                    original: chunks[key],
                    translated_es: translated_es_obj[key] ?? "",
                    translated_de: translated_de_obj[key] ?? "",
                }))

                send("done", {
                    text: extractedText,
                    translated_es,
                    translated_de,
                    total: total || pages.length,
                    pages,
                    matches,
                    paragraphMap,
                })

            } catch (err) {
                send("error", {
                    message: err instanceof Error ? err.message : "Unknown error"
                })
            } finally {
                controller.close()
            }
        }
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    })
}