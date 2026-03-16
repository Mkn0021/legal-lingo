import OpenAI from "openai"
import { NextRequest } from "next/server"
import { generateChatSystemPrompt } from "@/lib/utils"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
    const { messages, documentContext, language } = await req.json()

    const systemPrompt = generateChatSystemPrompt(documentContext, language)

    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content ?? ""
                if (text) {
                    controller.enqueue(encoder.encode(text))
                }
            }
            controller.close()
        },
    })

    return new Response(readable, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
        },
    })
}