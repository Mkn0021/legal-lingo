"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import {
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Globe,
    Link as LinkIcon,
} from "lucide-react"
import { BoundingBox, MatchedTerm, ResultViewProps, ScanResult } from "@/lib/types"
import { RISK, RiskLevel } from "@/lib/constant"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

function getRisk(term: MatchedTerm, lang: "es" | "de"): RiskLevel {
    const flag = lang === "es" ? term.flag_es : term.flag_de
    if (flag === "RED") return "danger"
    if (flag === "AMBER") return "warning"
    return "safe"
}

function TopBar({
    redCount,
    amberCount,
}: {
    redCount: number
    amberCount: number
}) {
    return (
        <div className="flex items-center justify-between border-b border-black/5 shrink-0 p-4">
            <div>
                <h1 className="text-2xl font-medium text-gray-950">Analysis Complete</h1>
                <p className="text-sm text-gray-600">{redCount} high risk | {amberCount} caution</p>
            </div>
            <Button variant="outline" className="shadow-none">
                <Globe size={14} />
                <span>Spain</span>
            </Button>
        </div>
    )
}

function PageNav({
    currentPage,
    numPages,
    onPrev,
    onNext,
}: {
    currentPage: number
    numPages: number
    onPrev: () => void
    onNext: () => void
}) {
    if (numPages <= 1) return null
    return (
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-black/8">
            <button
                onClick={onPrev}
                disabled={currentPage === 1}
                className="disabled:opacity-30 hover:text-gray-900 transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-gray-700">Page {currentPage} of {numPages}</span>
            <button
                onClick={onNext}
                disabled={currentPage === numPages}
                className="disabled:opacity-30 hover:text-gray-900 transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    )
}

function HighlightOverlay({
    boxesOnPage,
    scale,
    pdfNativeWidth,
    pdfNativeHeight,
    activeTermId,
    lang,
    onHighlightClick,
}: {
    boxesOnPage: { box: BoundingBox; term: MatchedTerm }[]
    scale: number
    pdfNativeWidth: number
    pdfNativeHeight: number
    activeTermId: number | null
    lang: "es" | "de"
    onHighlightClick: (term: MatchedTerm) => void
}) {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{ width: pdfNativeWidth * scale, height: pdfNativeHeight * scale }}
        >
            {boxesOnPage.map(({ box, term }, i) => {
                const risk = getRisk(term, lang)
                const r = RISK[risk]
                const isActive = activeTermId === term.id
                return (
                    <div
                        key={i}
                        className="absolute pointer-events-auto cursor-pointer transition-all duration-150"
                        style={{
                            left: box.x * scale,
                            top: box.y * scale,
                            width: box.width * scale,
                            height: box.height * scale,
                            backgroundColor: isActive ? r.highlightActive : r.highlight,
                            borderBottom: `2px solid ${isActive ? r.highlightActive.replace("0.5", "0.9") : r.highlight.replace("0.25", "0.7")}`,
                            borderRadius: 2,
                        }}
                        onClick={() => onHighlightClick(term)}
                    />
                )
            })}
        </div>
    )
}

function TermCard({
    term,
    lang,
    isActive,
    cardRef,
    onCardClick,
}: {
    term: MatchedTerm
    lang: "es" | "de"
    isActive: boolean
    cardRef: (el: HTMLDivElement | null) => void
    onCardClick: () => void
}) {
    const risk = getRisk(term, lang)
    const r = RISK[risk]
    const flagReason = lang === "es" ? term.flag_reason_es : term.flag_reason_de

    return (
        <div
            ref={cardRef}
            onClick={onCardClick}
            className={`
                rounded-xl border p-3.5 cursor-pointer
                transition-all duration-200 select-none scroll-my-20
                ${isActive ? r.cardActive : r.card + " hover:shadow-sm"}
            `}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="font-medium text-lg text-gray-950 truncate">
                    {term.matchedPhrase}
                </p>
                <Button variant="outline" size="xs" className="shadow-none">
                    {r.label}
                </Button>
            </div>

            {flagReason && (
                <p className="text-sm text-gray-600 text-balance">{flagReason}</p>
            )}

            {isActive && (
                <div className="mt-3 pt-3 border-t border-black/8 flex flex-col gap-2">
                    {term.explanation_en && (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {term.explanation_en}
                        </p>
                    )}
                    {term.source_url && (
                        <Link
                            href={term.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 hover:underline w-fit"
                        >
                            {term.source_name}
                            <ExternalLink size={10} />
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

function RightPanel({
    matches,
    lang,
    activeTermId,
    cardRefs,
    onCardClick,
}: {
    matches: MatchedTerm[]
    lang: "es" | "de"
    activeTermId: number | null
    cardRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>
    onCardClick: (term: MatchedTerm) => void
}) {
    return (
        <div className="w-90 h-full shrink-0 flex flex-col overflow-hidden border-l border-black/8 bg-gray-50">
            <div className="p-4 bg-white border-b border-black/8 shrink-0 flex items-center text-gray-700 gap-2">
                <LinkIcon size={24} /> <span>Extracted Terms</span>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col gap-4 min-h-0">
                {matches.map(term => (
                    <TermCard
                        key={term.id}
                        term={term}
                        lang={lang}
                        isActive={activeTermId === term.id}
                        cardRef={el => { cardRefs.current[term.id] = el }}
                        onCardClick={() => onCardClick(term)}
                    />
                ))}
            </div>
        </div>
    )
}

export function ResultView({ data, file }: ResultViewProps) {
    const [lang, setLang] = useState<"es" | "de">("es")
    const [activeTermId, setActiveTermId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageWidth, setPageWidth] = useState<number>(0)
    const [numPages, setNumPages] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})

    const result = data as ScanResult
    if (!result?.matches) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">No data to display.</p>
            </div>
        )
    }

    const matches = result.matches
    const pageMeta = result.pages ?? []
    const redCount = matches.filter(m => (lang === "es" ? m.flag_es : m.flag_de) === "RED").length
    const amberCount = matches.filter(m => (lang === "es" ? m.flag_es : m.flag_de) === "AMBER").length

    const pdfPageMeta = pageMeta.find(p => p.num === currentPage)
    const pdfNativeWidth = pdfPageMeta?.width ?? 612
    const pdfNativeHeight = pdfPageMeta?.height ?? 792
    const scale = pageWidth > 0 ? pageWidth / pdfNativeWidth : 1

    const onDocumentLoad = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }, [])

    const onPageLoad = useCallback(() => {
        if (containerRef.current) {
            setPageWidth(containerRef.current.clientWidth)
        }
    }, [])

    function handleHighlightClick(term: MatchedTerm) {
        const next = activeTermId === term.id ? null : term.id
        setActiveTermId(next)
        if (next !== null) {
            setTimeout(() => {
                cardRefs.current[term.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" })
            }, 50)
        }
    }

    function handleCardClick(term: MatchedTerm) {
        const next = activeTermId === term.id ? null : term.id
        setActiveTermId(next)
        if (next !== null && term.pages?.[0]) {
            setCurrentPage(term.pages[0])
        }
    }

    const boxesOnPage = matches.flatMap(m =>
        (m.boundingBoxes ?? [])
            .filter(b => b.page === currentPage)
            .map(b => ({ box: b, term: m }))
    )

    const fileUrl = file ? URL.createObjectURL(file) : null

    return (
        <div className="relative flex flex-col w-full h-[calc(100vh-64px)] bg-white rounded-2xl shadow-xl ring-1 ring-black/10 p-2 min-h-0 z-10 mt-16">
            <div className="absolute -inset-2 rounded-[calc(var(--radius-lg)+8px)] shadow-xs ring-1 ring-black/5 pointer-events-none" />
            <TopBar redCount={redCount} amberCount={amberCount} />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className={cn(
                    "flex-1 overflow-y-auto bg-gray-50 flex flex-col items-center py-6 gap-4",
                    "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-gray-200)]"
                )}>
                    <div
                        ref={containerRef}
                        className="relative shadow-xl rounded-sm bg-white w-[calc(100%-48px)] max-w-3xl"
                        style={{ width: "calc(100% - 48px)", maxWidth: "800px" }}
                    >
                        {fileUrl ? (
                            <>
                                <Document
                                    file={fileUrl}
                                    onLoadSuccess={onDocumentLoad}
                                    loading={
                                        <div className="flex items-center justify-center h-96 text-gray-400 text-sm">
                                            Loading PDF…
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={currentPage}
                                        width={containerRef.current?.clientWidth ?? undefined}
                                        onLoadSuccess={onPageLoad}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                                <HighlightOverlay
                                    boxesOnPage={boxesOnPage}
                                    scale={scale}
                                    pdfNativeWidth={pdfNativeWidth}
                                    pdfNativeHeight={pdfNativeHeight}
                                    activeTermId={activeTermId}
                                    lang={lang}
                                    onHighlightClick={handleHighlightClick}
                                />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-gray-400 text-sm">
                                No PDF file provided.
                            </div>
                        )}
                    </div>
                    <PageNav
                        currentPage={currentPage}
                        numPages={numPages}
                        onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNext={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                    />
                </div>

                <RightPanel
                    matches={matches}
                    lang={lang}
                    activeTermId={activeTermId}
                    cardRefs={cardRefs}
                    onCardClick={handleCardClick}
                />
            </div>
        </div>
    )
}