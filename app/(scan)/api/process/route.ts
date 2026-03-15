import { NextRequest, NextResponse } from "next/server"
import { extractText, loadTerms, matchTerms } from "@/app/(scan)/actions"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

        const buffer = Buffer.from(await file.arrayBuffer())
        const doc = await extractText(buffer)
        const terms = await loadTerms()
        const matches = matchTerms(doc, terms)

        return NextResponse.json({
            text: doc.text,
            total: doc.total,
            matches
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}