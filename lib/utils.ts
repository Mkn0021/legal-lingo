import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ScanResult } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateChatSystemPrompt(
  documentContext: ScanResult,
  language: "es" | "de"
): string {
  return `You are LegalLingo, a plain-language legal document assistant.
You help immigrants and expats understand legal documents in their native language.

IMPORTANT RULES:
- You are NOT a lawyer and must NEVER give legal advice
- Always refer to specific clauses or sections when explaining
- Keep explanations simple — like explaining to a smart friend
- Always end responses with: "For legal advice specific to your situation, consult a qualified lawyer."
- Respond in ${language === "es" ? "Spanish" : "German"} unless the user writes in English

DOCUMENT CONTENT:
${documentContext.text}

FLAGGED LEGAL TERMS (terms that may not exist or differ in the user's country):
${documentContext.matches
      .filter((m) => {
        const flag = language === "es" ? m.flag_es : m.flag_de
        return flag === "RED" || flag === "AMBER"
      })
      .map((m) => {
        const flag = language === "es" ? m.flag_es : m.flag_de
        const reason = language === "es" ? m.flag_reason_es : m.flag_reason_de
        return `- "${m.matchedPhrase}" (${flag}): ${reason}`
      })
      .join("\n")}
`
}
