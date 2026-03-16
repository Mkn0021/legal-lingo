"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { CheckIcon, Loader2 } from "lucide-react"

const STEPS = [
    "Extracting text from PDF",
    "Loading legal terms",
    "Matching terms",
    "Translating document",
    "Finalizing results",
]

interface MultiStepLoaderProps {
    file: File
    onDone: (data: unknown) => void
    onError: (message: string) => void
}

export function MultiStepLoader({ file, onDone, onError }: MultiStepLoaderProps) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        let isCancelled = false

        async function run() {
            try {
                // Dynamically import PDF extraction (only runs in browser)
                const { extractPdfText } = await import("@/lib/client/pdf-extract")

                // Step 0: Extract PDF text on client
                setCurrent(0)
                const extractedData = await extractPdfText(file)

                if (isCancelled) return

                // Send to API
                const res = await fetch("/api/process", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        extractedText: extractedData.text,
                        pages: extractedData.pages,
                        words: extractedData.words,
                        total: extractedData.total,
                    }),
                })

                if (!res.ok || !res.body) {
                    onError("Failed to connect to scan API")
                    return
                }

                const reader = res.body.getReader()
                const decoder = new TextDecoder()
                let buffer = ""

                while (true) {
                    const { done, value } = await reader.read()
                    if (done || isCancelled) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split("\n\n")
                    buffer = lines.pop() ?? ""

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue
                        try {
                            const { event, data } = JSON.parse(line.slice(6))

                            if (event === "step") {
                                // Offset by 1 since we already did extraction
                                setCurrent(data.step + 1)
                            }

                            if (event === "done") {
                                setCurrent(STEPS.length)
                                if (!isCancelled) onDone(data)
                            }

                            if (event === "error") {
                                onError(data.message)
                            }
                        } catch {
                            // malformed chunk — skip
                        }
                    }
                }
            } catch (err) {
                if (!isCancelled) {
                    onError(err instanceof Error ? err.message : "Something went wrong")
                }
            }
        }

        run()

        return () => { isCancelled = true }
    }, [file])

    return (
        <div className="flex w-full h-screen justify-center text-center items-center z-10 bg-[radial-gradient(ellipse_at_center,white_0%,transparent_75%)]">
            <div className="flex flex-col">
                {STEPS.map((step, i) => {
                    const status =
                        i < current ? "completed"
                            : i === current ? "active"
                                : "default"

                    return (
                        <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    "size-7 rounded-full flex items-center justify-center shrink-0 text-neutral-50",
                                    {
                                        "bg-yellow-500": status === "active",
                                        "border border-neutral-300 text-neutral-400": status === "default",
                                        "bg-neutral-700": status === "completed",
                                    }
                                )}>
                                    {status === "active"
                                        ? <Loader2 className="size-4 animate-spin" />
                                        : <CheckIcon className="size-4" />}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn("w-0.5 flex-1 min-h-6", {
                                        "bg-neutral-700": status === "completed",
                                        "bg-neutral-200": status !== "completed",
                                    })} />
                                )}
                            </div>
                            <div className="pb-6 flex items-center">
                                <span className={cn("text-base", {
                                    "text-neutral-400": status === "default",
                                    "text-neutral-900 font-medium": status === "active",
                                    "text-neutral-500": status === "completed",
                                })}>
                                    {step}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}