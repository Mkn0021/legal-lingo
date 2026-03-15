import { db } from "@/lib/db"
import { SmartPDFParser } from 'pdf-parse-new'

export interface LegalTerm {
    id: number
    english_term: string
    english_clean: string
    category: string
    explanation_en: string
    source_url: string
    source_name: string
    flag_es: string
    flag_de: string
    flag_reason_es: string
    flag_reason_de: string
    word_count: number
    aliases: string
}

export interface MatchedTerm extends LegalTerm {
    matchedPhrase: string
    positions: number[]
    pages: number[]
}

export interface ParsedDocument {
    text: string
    pages: Array<{ num: number; text: string }>
    total: number
}

export async function extractText(buffer: Buffer): Promise<ParsedDocument> {
    const parser = new SmartPDFParser()
    const result = await parser.parse(buffer)

    const pages = result.text.split('\f').map((text: string, i: number) => ({
        num: i + 1,
        text: text.trim()
    }))

    return {
        text: result.text,
        pages: pages.length > 0 ? pages : [{ num: 1, text: result.text }],
        total: result.numpages,
    }
}

export async function loadTerms(): Promise<LegalTerm[]> {
    const result = await db.execute({
        sql: 'SELECT * FROM legal_terms ORDER BY word_count DESC',
        args: []
    })

    return result.rows.map((row) => ({
        id: row.id as number,
        english_term: row.english_term as string,
        english_clean: row.english_clean as string,
        category: row.category as string,
        explanation_en: row.explanation_en as string,
        source_url: row.source_url as string,
        source_name: row.source_name as string,
        flag_es: row.flag_es as string,
        flag_de: row.flag_de as string,
        flag_reason_es: row.flag_reason_es as string,
        flag_reason_de: row.flag_reason_de as string,
        word_count: row.word_count as number,
        aliases: row.aliases as string,
    }))
}

function getPageNumbers(
    positions: number[],
    pages: Array<{ num: number; text: string }>
): number[] {
    const offsets: number[] = []
    let cursor = 0
    for (const page of pages) {
        offsets.push(cursor)
        cursor += page.text.length
    }

    return [...new Set(positions.map(pos => {
        let lo = 0, hi = offsets.length - 1
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2)
            if (offsets[mid] <= pos) lo = mid
            else hi = mid - 1
        }
        return lo + 1
    }))]
}

export function matchTerms(doc: ParsedDocument, terms: LegalTerm[]): MatchedTerm[] {
    const matched: MatchedTerm[] = []
    const usedRanges: Array<[number, number]> = []
    const lowerText = doc.text.toLowerCase()

    const isOverlapping = (start: number, end: number) =>
        usedRanges.some(([s, e]) => start < e && end > s)

    for (const term of terms) {
        const candidates = [
            term.english_term,
            term.english_clean,
            ...(term.aliases ? term.aliases.split(",").map(a => a.trim()) : [])
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
                const pages = getPageNumbers(positions, doc.pages)
                matched.push({ ...term, matchedPhrase: candidate, positions, pages })
                break
            }
        }
    }

    return matched
}
