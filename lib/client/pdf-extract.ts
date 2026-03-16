"use client"

import * as pdfjs from "pdfjs-dist"
import { ExtractedPdfData, WordToken } from "@/lib/types"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"


export async function extractPdfText(file: File): Promise<ExtractedPdfData> {
    const arrayBuffer = await file.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)
    
    const pdf = await pdfjs.getDocument({
        data: uint8,
    }).promise

    let fullText = ""
    const pages: Array<{ num: number; text: string; width: number; height: number }> = []
    const words: WordToken[] = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 1 })
        const content = await page.getTextContent()

        let pageText = ""
        const pageStartOffset = fullText.length

        for (const item of content.items) {
            if (!("str" in item)) continue
            const str = (item as { str: string }).str
            if (!str.trim()) continue

            const tx = (item as { transform: number[] }).transform
            const itemX = tx[4]
            const itemYBottom = tx[5]
            const itemHeight = Math.abs((item as { height: number }).height) || 10
            const itemWidth = (item as { width: number }).width || str.length * 5
            const itemY = viewport.height - itemYBottom - itemHeight

            const rawWords = str.split(/(\s+)/)
            const charWidthEst = itemWidth / str.length
            let localX = itemX
            let localOffset = 0

            for (const chunk of rawWords) {
                if (!chunk.trim()) {
                    localX += chunk.length * charWidthEst
                    localOffset += chunk.length
                    continue
                }

                words.push({
                    text: chunk,
                    page: pageNum,
                    x: localX,
                    y: itemY,
                    width: chunk.length * charWidthEst,
                    height: itemHeight,
                    charOffset: pageStartOffset + pageText.length + localOffset,
                })

                localX += chunk.length * charWidthEst
                localOffset += chunk.length
            }

            pageText += str + " "
        }

        fullText += pageText
        pages.push({
            num: pageNum,
            text: pageText.trim(),
            width: viewport.width,
            height: viewport.height,
        })
    }

    return {
        text: fullText,
        pages,
        words,
        total: pdf.numPages,
    }
}
