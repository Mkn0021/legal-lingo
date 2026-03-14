"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "../ui/button";

const DEMO_FILES = [
    { name: "employment_contract.pdf", label: "Employment Contract" },
    { name: "residential_lease.pdf", label: "Residential Lease" },
    { name: "visa_support_letter.pdf", label: "Visa Support Letter" },
];

export function UploadBox() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (newFiles: File[]) => {
        setFiles(newFiles);
        console.log(newFiles);
    };

    const handleDemoFileSelect = async (fileName: string) => {
        try {
            const response = await fetch(`/demos/${fileName}`);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: "application/pdf" });
            setFiles([file]);
            handleFileUpload([file]);
        } catch (error) {
            console.error("Error loading demo file:", error);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col gap-8 max-w-screen px-4 md:mt-16">
            <FileUpload
                onChange={handleFileUpload}
                title="Upload your legal document"
                description="Drag, drop, or click to upload PDF files. We'll analyze and explain them."
            />
            <div className="flex justify-center items-center gap-2 md:gap-4 px-4 z-10">
                {DEMO_FILES.map((demo) => (
                    <Button
                        key={demo.name}
                        variant="outline"
                        onClick={() => handleDemoFileSelect(demo.name)}
                        className="bg-gray-50/50 hover:bg-gray-100 text-gray-700 border-gray-200 text-[10px] px-2 md:px-4 md:text-base"
                    >
                        {demo.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}