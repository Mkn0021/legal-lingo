import { cn } from "@/lib/utils"
import { CheckIcon, Loader2 } from "lucide-react"

const STEPS = [
    "Uploading document",
    "Analyzing content",
    "Generating summary",
    "Finalizing output"
]

export function MultiStepLoader({ onDone }: { onDone: () => void }) {
    return (
        <div className="flex w-full h-full justify-center text-center items-center z-10 bg-[radial-gradient(ellipse_at_center,white_0%,transparent_75%)]">
            <div className="flex flex-col">
                {STEPS.map((step, index) => (
                    <LoaderStep
                        key={index}
                        step={step}
                        isLast={index === STEPS.length - 1}
                        variant={
                            index === 2 ? "active" : index < 2 ? "completed" : "default"
                        }
                    />
                ))}
            </div>
        </div>
    )
}

const LoaderStep = ({ step, variant = "default", isLast = false }: {
    step: string,
    variant: "active" | "completed" | "default",
    isLast?: boolean
}) => {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={cn(
                    "size-7 rounded-full flex items-center justify-center shrink-0 text-neutral-50",
                    {
                        "bg-yellow-500": variant === "active",
                        "border border-neutral-300 text-neutral-400": variant === "default",
                        "bg-neutral-700": variant === "completed",
                    }
                )}>
                    {variant === "active"
                        ? <Loader2 className="size-4 animate-spin" />
                        : <CheckIcon className="size-4" />}
                </div>
                {!isLast && (
                    <div className={cn("w-0.5 flex-1", {
                        "bg-neutral-700": variant === "completed",
                        "bg-neutral-200": variant !== "completed",
                    })} />
                )}
            </div>
            <div className="pb-6 flex items-center">
                <span className={cn("text-base", {
                    "text-neutral-400": variant === "default"
                })}>{step}</span>
            </div>
        </div>
    )
}