"use client"

import { useState, useRef, useCallback, useMemo } from "react"
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
    FileText,
    Languages,
    MessageCircle,
} from "lucide-react"
import { BoundingBox, MatchedTerm, ParagraphMap, ResultViewProps, ScanResult } from "@/lib/types"
import { RISK, RiskLevel } from "@/lib/constant"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { SectionBox } from "../homepage/section"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChatHandler } from "./chat-handler"

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
}

function getRisk(term: MatchedTerm, lang: "es" | "de"): RiskLevel {
    const flag = lang === "es" ? term.flag_es : term.flag_de
    if (flag === "RED") return "danger"
    if (flag === "AMBER") return "warning"
    return "safe"
}

function TopBar({
    redCount,
    amberCount,
    language,
    setLanguage,
    viewMode,
    setViewMode,
}: {
    redCount: number
    amberCount: number
    language: "es" | "de"
    setLanguage: (lang: "es" | "de") => void
    viewMode: "original" | "translated"
    setViewMode: (mode: "original" | "translated") => void
}) {
    return (
        <div className="flex items-center justify-between border-b border-black/5 shrink-0 p-4">
            <div>
                <h1 className="text-2xl font-medium text-gray-950">Analysis Complete</h1>
                <p className="text-sm text-gray-600">{redCount} high risk | {amberCount} caution</p>
            </div>
            <div className="flex items-center gap-3">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "original" | "translated")}>
                    <TabsList>
                        <TabsTrigger value="original" title="Original">
                            <FileText size={24} />
                        </TabsTrigger>
                        <TabsTrigger value="translated" title="Translated">
                            <Languages size={24} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="shadow-none">
                            <Globe size={14} />
                            <span>{language === 'es' ? 'Spanish' : 'German'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLanguage('es')}>
                            Spanish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('de')}>
                            German
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
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

function TranslatedView({
    paragraphMap,
    matches,
    lang,
    activeTermId,
    onTermClick,
}: {
    paragraphMap: ParagraphMap[]
    matches: MatchedTerm[]
    lang: "es" | "de"
    activeTermId: number | null
    onTermClick: (term: MatchedTerm) => void
}) {
    const paragraphTerms = useMemo(() => {
        const map = new Map<number, MatchedTerm[]>()

        for (const term of matches) {
            for (let i = 0; i < paragraphMap.length; i++) {
                const para = paragraphMap[i]
                if (para.original.toLowerCase().includes(
                    term.matchedPhrase.toLowerCase()
                )) {
                    const existing = map.get(i) ?? []
                    map.set(i, [...existing, term])
                }
            }
        }

        return map
    }, [matches, paragraphMap])

    return (
        <div className="p-8 font-serif text-sm leading-7 text-gray-800">
            {paragraphMap.map((para, i) => {
                const terms = paragraphTerms.get(i) ?? []
                const translatedPara = lang === "es"
                    ? para.translated_es
                    : para.translated_de

                if (terms.length === 0) {
                    return (
                        <p key={i} className="mb-4">
                            {translatedPara}
                        </p>
                    )
                }

                const highestRiskTerm = terms.reduce((prev, curr) => {
                    const prevFlag = lang === "es" ? prev.flag_es : prev.flag_de
                    const currFlag = lang === "es" ? curr.flag_es : curr.flag_de
                    if (currFlag === "RED") return curr
                    if (currFlag === "AMBER" && prevFlag !== "RED") return curr
                    return prev
                })

                const risk = getRisk(highestRiskTerm, lang)
                const r = RISK[risk]
                const isActive = terms.some(t => t.id === activeTermId)

                return (
                    <p
                        key={i}
                        className="mb-4 rounded px-2 py-1 cursor-pointer transition-all duration-150 -mx-2"
                        style={{
                            backgroundColor: isActive
                                ? r.highlightActive
                                : r.highlight,
                            borderLeft: `3px solid ${isActive
                                ? r.highlightActive.replace("0.5", "0.9")
                                : r.highlight.replace("0.25", "0.7")}`,
                        }}
                        onClick={() => onTermClick(highestRiskTerm)}
                    >
                        {translatedPara}
                    </p>
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
    onAskInChat,
}: {
    term: MatchedTerm
    lang: "es" | "de"
    isActive: boolean
    cardRef: (el: HTMLDivElement | null) => void
    onCardClick: () => void
    onAskInChat: (message: string) => void
}) {
    const risk = getRisk(term, lang)
    const r = RISK[risk]
    const flagReason = lang === "es" ? term.flag_reason_es : term.flag_reason_de
    const translation = lang === "es" ? term.translation_es : term.translation_de

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
            <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-medium text-base text-gray-950 truncate">
                        {term.matchedPhrase}
                    </p>
                    {translation && (
                        <p className="text-xs text-gray-400 truncate italic">
                            {translation}
                        </p>
                    )}
                </div>
                <Button variant="outline" size="xs" className="shadow-none shrink-0 ml-2">
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

                    <div className="flex items-center justify-between">
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

                        <Button
                            size="sm"
                            onClick={e => {
                                e.stopPropagation()
                                onAskInChat(
                                    `Explain "${term.matchedPhrase}" in simple terms. Does this concept exist in my country and should I be concerned about it?`
                                )
                            }}
                        >
                            <MessageCircle size={14} />
                            Ask about this
                        </Button>
                    </div>
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
    rightView,
    setRightView,
    chatPrefill,
    onCloseChat,
    onAskInChat,
    result,
    chatMessages,
    setChatMessages,
}: {
    matches: MatchedTerm[]
    lang: "es" | "de"
    activeTermId: number | null
    cardRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>
    onCardClick: (term: MatchedTerm) => void
    rightView: 'terms' | 'chat'
    setRightView: (view: 'terms' | 'chat') => void
    chatPrefill: string | null
    onCloseChat: () => void
    onAskInChat: (message: string) => void
    result: ScanResult
    chatMessages: Array<{ role: "user" | "assistant"; content: string; isStreaming?: boolean }>
    setChatMessages: (messages: Array<{ role: "user" | "assistant"; content: string; isStreaming?: boolean }> | ((prev: Array<{ role: "user" | "assistant"; content: string; isStreaming?: boolean }>) => Array<{ role: "user" | "assistant"; content: string; isStreaming?: boolean }>)) => void
}) {
    return (
        <div className="w-90 h-full shrink-0 flex flex-col overflow-hidden border-l border-black/8 bg-gray-50">
            {rightView === "terms" && (
                <>
                    <div className="p-4 bg-white border-b border-black/8 shrink-0 flex items-center justify-between">
                        <div className="flex items-center text-gray-700 gap-2">
                            <LinkIcon size={24} /> <span>Extracted Terms</span>
                        </div>
                        <Button className="p-2" onClick={() => setRightView('chat')}>
                            <MessageCircle size={20} />
                        </Button>
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
                                onAskInChat={onAskInChat}
                            />
                        ))}
                    </div>
                </>
            )}

            {rightView === "chat" && (
                <ChatHandler
                    onClose={onCloseChat}
                    prefill={chatPrefill}
                    documentContext={result}
                    language={lang}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                />
            )}
        </div>
    )
}

export function ResultView({ data, file }: ResultViewProps) {
    const [lang, setLang] = useState<"es" | "de">("es")
    const [viewMode, setViewMode] = useState<"original" | "translated">("original")
    const [rightView, setRightView] = useState<'terms' | 'chat'>('terms')
    const [chatPrefill, setChatPrefill] = useState<string | null>(null)
    const [activeTermId, setActiveTermId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageWidth, setPageWidth] = useState<number>(0)
    const [numPages, setNumPages] = useState(0)
    const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; isStreaming?: boolean }>>([])
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
        setRightView('terms')
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

    const boxesOnPage = useMemo(() => {
        return matches.flatMap(m =>
            (m.boundingBoxes ?? [])
                .filter(b => b.page === currentPage)
                .map(b => ({ box: b, term: m }))
        )
    }, [matches, currentPage])

    const fileUrl = useMemo(() => {
        return file ? URL.createObjectURL(file) : null
    }, [file])

    function handleAskInChat(message: string) {
        setChatPrefill(message)
        setRightView('chat')
    }

    return (
        <SectionBox className="flex flex-col h-[calc(100vh-64px)] p-2">
            <TopBar
                redCount={redCount}
                amberCount={amberCount}
                language={lang}
                setLanguage={setLang}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <div className="flex flex-1 min-h-0 overflow-hidden rounded-[calc(var(--radius-2xl)-8px)]">
                <div className={cn(
                    "flex-1 overflow-y-auto bg-gray-50 flex flex-col items-center py-6 gap-4",
                    "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-gray-200)]"
                )}>
                    <div
                        ref={containerRef}
                        className="relative shadow-xl rounded-sm bg-white w-[calc(100%-48px)] max-w-3xl"
                        style={{ width: "calc(100% - 48px)", maxWidth: "800px" }}
                    >
                        {viewMode === "translated" ? (
                            <TranslatedView
                                matches={matches}
                                lang={lang}
                                activeTermId={activeTermId}
                                onTermClick={handleHighlightClick}
                                paragraphMap={result.paragraphMap}
                            />
                        ) : fileUrl ? (
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
                    {viewMode === "original" && (
                        <PageNav
                            currentPage={currentPage}
                            numPages={numPages}
                            onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
                            onNext={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                        />
                    )}
                </div>

                <RightPanel
                    matches={matches}
                    lang={lang}
                    activeTermId={activeTermId}
                    cardRefs={cardRefs}
                    onCardClick={handleCardClick}
                    rightView={rightView}
                    setRightView={setRightView}
                    chatPrefill={chatPrefill}
                    onCloseChat={() => setRightView('terms')}
                    onAskInChat={handleAskInChat}
                    result={result}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                />
            </div>
        </SectionBox>
    )
}