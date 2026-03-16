import { db } from "@/lib/db"
import {
    LegalTerm,
    BoundingBox,
    MatchedTerm,
    PageMeta,
    WordToken,
} from "@/lib/types"

export async function loadTerms(): Promise<LegalTerm[]> {
    const result = await db.execute({
        sql: `SELECT * FROM legal_terms 
              WHERE word_count > 1 
                 OR flag_es IN ('RED', 'AMBER') 
                 OR flag_de IN ('RED', 'AMBER')
              ORDER BY word_count DESC`,
        args: [],
    })

    return result.rows.map((row) => ({
        id: row.id as number,
        english_term: row.english_term as string,
        english_clean: row.english_clean as string,
        category: row.category as string,
        explanation_en: row.explanation_en as string,
        source_url: row.source_url as string,
        source_name: row.source_name as string,
        translation_es: row.translation_es as string,
        translation_de: row.translation_de as string,
        flag_es: row.flag_es as string,
        flag_de: row.flag_de as string,
        flag_reason_es: row.flag_reason_es as string,
        flag_reason_de: row.flag_reason_de as string,
        word_count: row.word_count as number,
        aliases: row.aliases as string,
    }))
}

function getPageNumbers(positions: number[], pages: PageMeta[]): number[] {
    const offsets: number[] = []
    let cursor = 0
    for (const page of pages) {
        offsets.push(cursor)
        cursor += page.text.length
    }

    return [...new Set(positions.map((pos) => {
        let lo = 0, hi = offsets.length - 1
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2)
            if (offsets[mid] <= pos) lo = mid
            else hi = mid - 1
        }
        return lo + 1
    }))]
}

function findBoundingBoxes(
    phrase: string,
    positions: number[],
    words: WordToken[],
    pages: PageMeta[]
): BoundingBox[] {
    const boxes: BoundingBox[] = []
    const phraseWordCount = phrase.trim().split(/\s+/).length

    for (const pos of positions) {
        const startWord = words.find((w) => w.charOffset >= pos && w.charOffset < pos + phrase.length)
        if (!startWord) continue

        const startIdx = words.indexOf(startWord)
        const span = words.slice(startIdx, startIdx + phraseWordCount)
        if (!span.length) continue

        const page = span[0].page
        const x = Math.min(...span.map((w) => w.x))
        const y = Math.min(...span.map((w) => w.y))
        const right = Math.max(...span.map((w) => w.x + w.width))
        const bottom = Math.max(...span.map((w) => w.y + w.height))

        boxes.push({
            page,
            x,
            y,
            width: right - x,
            height: bottom - y,
        })
    }

    return boxes
}

export function matchTerms(
    text: string,
    pages: PageMeta[],
    words: WordToken[],
    terms: LegalTerm[]
): MatchedTerm[] {
    const matched: MatchedTerm[] = []
    const usedRanges: Array<[number, number]> = []
    const lowerText = text.toLowerCase()

    const isOverlapping = (start: number, end: number) =>
        usedRanges.some(([s, e]) => start < e && end > s)

    for (const term of terms) {
        const candidates = [
            term.english_term,
            term.english_clean,
            ...(term.aliases ? term.aliases.split(",").map((a) => a.trim()) : []),
        ].filter(Boolean)

        for (const candidate of candidates) {
            const lower = candidate.toLowerCase()
            let idx = lowerText.indexOf(lower)
            const positions: number[] = []

            while (idx !== -1) {
                const end = idx + lower.length
                if (!isOverlapping(idx, end)) {
                    positions.push(idx)
                    usedRanges.push([idx, end])
                }
                idx = lowerText.indexOf(lower, idx + 1)
            }

            if (positions.length > 0) {
                const pageNumbers = getPageNumbers(positions, pages)
                const boundingBoxes = findBoundingBoxes(candidate, positions, words, pages)
                matched.push({
                    ...term,
                    matchedPhrase: candidate,
                    positions,
                    pages: pageNumbers,
                    boundingBoxes,
                })
                break
            }
        }
    }

    return matched
}
