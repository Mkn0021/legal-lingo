"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Logo } from "@/components/homepage/logo"
import { GridPattern } from "@/components/ui/file-upload"
import { UploadBox } from "@/components/scanpage/upload-box"
import { TopGradient } from "@/components/homepage/gradient-background"
import { MultiStepLoader } from "@/components/scanpage/multi-step-loader"

const ResultView = dynamic(() => import("@/components/scanpage/result-view").then(m => ({ default: m.ResultView })), { ssr: false })

type Stage = "upload" | "processing" | "result";

export default function Page() {
    const [stage, setStage] = useState<Stage>("upload");
    const [data, setData] = useState<unknown>(null)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleStart = (uploadedFile: File) => {
        setFile(uploadedFile)
        setError(null)
        setStage("processing")
    }

    const handleDone = (result: unknown) => {
        setData(result)
        setStage("result")
    }

    const handleError = (message: string) => {
        setError(message)
        setStage("upload")
    }

    return (
        <PageContainer>
            <nav className="absolute top-0 left-4 z-50">
                <Logo />
            </nav>

            {stage === "upload" && (
                <div className="flex flex-col items-center justify-center gap-4">
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                            {error}
                        </p>
                    )}
                    <UploadBox onStart={handleStart} />
                </div>
            )}

            {stage === "processing" && file && (
                <MultiStepLoader
                    file={file}
                    onDone={handleDone}
                    onError={handleError}
                />
            )}

            {stage === "result" && (
                <ResultView data={data} file={file} />
            )}
        </PageContainer>
    )
}

const PageContainer = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative overflow-hidden max-w-screen min-h-screen">
        <GridPattern className="absolute inset-0 mask-radial-from-0% opacity-80" />
        <TopGradient />
        <div className="relative flex h-full items-center justify-center mx-auto max-w-2xl lg:max-w-4xl xl:max-w-7xl p-6 lg:p-8">
            {children}
        </div>
    </div>
);