import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "LegalLingo - Understand Legal Documents in Your Language",
    template: "%s | LegalLingo",
  },
  description: "Sign documents, not confusion. Upload any legal document, get it translated with legal expertise, flag tricky terms, and chat about what you don't understand.",
  keywords: ["legal translation", "document analysis", "legal terms", "multilingual", "contract review", "legal document", "translator"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
