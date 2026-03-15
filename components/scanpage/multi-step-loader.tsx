"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, Loader2 } from "lucide-react"

const STEPS = [
    "Extracting PDF text",
    "Loading legal terms",
    "Matching terms",
    "Generating results",
]

export function MultiStepLoader({ isReady, onDone }: { isReady: boolean; onDone: () => void }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        // All steps completed and data ready
        if (current > STEPS.length && isReady) {
            onDone()
            return
        }

        // Advance through steps
        if (current <= STEPS.length) {
            const timer = setTimeout(() => setCurrent(c => c + 1), 300)
            return () => clearTimeout(timer)
        }
    }, [current, isReady, onDone])

    return (
        <div className="flex w-full h-full justify-center text-center items-center z-10 bg-[radial-gradient(ellipse_at_center,white_0%,transparent_75%)]">
            <div className="flex flex-col">
                {STEPS.map((step, i) => {
                    const status = i < current ? "completed" : i === current ? "active" : "default"
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
                                    <div className={cn("w-0.5 flex-1", {
                                        "bg-neutral-700": status === "completed",
                                        "bg-neutral-200": status !== "completed",
                                    })} />
                                )}
                            </div>
                            <div className="pb-6 flex items-center">
                                <span className={cn("text-base", {
                                    "text-neutral-400": status === "default",
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