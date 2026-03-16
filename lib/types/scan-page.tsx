// Database schema - single source of truth for LegalTerm
export interface LegalTerm {
    id: number
    english_term: string
    english_clean: string
    category: string
    explanation_en: string
    source_url: string
    source_name: string
    translation_es: string
    translation_de: string
    flag_es: string
    flag_de: string
    flag_reason_es: string
    flag_reason_de: string
    word_count: number
    aliases: string
}

export interface BoundingBox {
    page: number
    x: number
    y: number
    width: number
    height: number
}

export interface PageMeta {
    num: number
    text: string
    width: number
    height: number
}

export interface WordToken {
    text: string
    page: number
    x: number
    y: number
    width: number
    height: number
    charOffset: number
}

export interface ParsedDocument {
    text: string
    pages: PageMeta[]
    total: number
}

export interface ParsedDocumentWithWords extends ParsedDocument {
    words: WordToken[]
}

export interface MatchedTerm extends LegalTerm {
    matchedPhrase: string
    positions: number[]
    pages: number[]
    boundingBoxes: BoundingBox[]
}

export interface ParagraphMap {
    index: number
    original: string
    translated_es: string
    translated_de: string
}

export interface ScanResult {
    text: string
    translated_es: string
    translated_de: string
    total: number
    pages: PageMeta[]
    matches: MatchedTerm[]
    paragraphMap: ParagraphMap[]
}

export interface ResultViewProps {
    data: unknown
    file: File | null
}