"use client";

import { useState, useRef } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";

const DEMO_FILES = [
    { name: "employment_contract.pdf", label: "Employment Contract" },
    { name: "residential_lease.pdf", label: "Residential Lease" },
    { name: "visa_support_letter.pdf", label: "Visa Support Letter" },
];

interface UploadBoxProps {
    onStart: () => void;
}

export function UploadBox({ onStart }: UploadBoxProps) {
    const [isLoading, setIsLoading] = useState(false);
    const fileUploadRef = useRef<{ loadFile: (file: File) => void } | null>(null);

    const handleDemoFileSelect = async (fileName: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/demos/${fileName}`);
            if (!response.ok) throw new Error("Failed to load demo file");
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: "application/pdf" });
            fileUploadRef.current?.loadFile(file);
            // Keep loading state visible for the full animation duration
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error loading demo file:", error);
            setIsLoading(false);
        }
    };

    const handleFinalize = (files: File[]) => {
        console.log("Processing files:", files);
        // Add your processing logic here
        onStart();
    };

    return (
        <div className="flex justify-center items-center flex-col gap-8 max-w-screen px-4 md:mt-16">
            <FileUpload
                ref={fileUploadRef}
                title="Upload your legal document"
                description="Drag, drop, or click to upload PDF files. We'll analyze and explain them."
                isLoading={isLoading}
                onFinalize={handleFinalize}
            />
            <div className="flex justify-center items-center gap-2 md:gap-4 px-4 z-10">
                {DEMO_FILES.map((demo) => (
                    <Button
                        key={demo.name}
                        variant="outline"
                        onClick={() => handleDemoFileSelect(demo.name)}
                        disabled={isLoading}
                        className="bg-gray-50/50 hover:bg-gray-100 text-gray-700 border-gray-200 text-[10px] px-2 md:px-4 md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {demo.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}