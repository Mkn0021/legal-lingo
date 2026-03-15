export interface BoundingBox {
    page: number
    x: number
    y: number
    width: number
    height: number
}

export interface MatchedTerm {
    id: number
    matchedPhrase: string
    explanation_en: string
    source_url: string
    source_name: string
    flag_es: string
    flag_de?: string
    flag_reason_es?: string
    flag_reason_de?: string
    positions: number[]
    pages: number[]
    boundingBoxes: BoundingBox[]
}

export interface PageMeta {
    num: number
    text: string
    width: number
    height: number
}

export interface ScanResult {
    text: string
    total: number
    pages: PageMeta[]
    matches: MatchedTerm[]
}

export interface ResultViewProps {
    data: unknown
    file: File | null
}