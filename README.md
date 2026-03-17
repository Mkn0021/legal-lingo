# LegalLingo

**Don't sign what you don't understand.**

25 million people in the US sign legal documents in a language they don't fully understand. A lease. An employment contract. A visa letter. Google Translate gives them words — but legal concepts like "at-will employment" or "escrow" don't just need translation. They need explanation, because the concept itself often doesn't exist in the signer's home country.

LegalLingo fixes that.

---

## What It Does

**[Demo Video](https://youtu.be/Iwm-T0hFkF0)**

Upload any legal document. Select your language. In seconds you get:
- The full document translated with a legal glossary attached — not generic machine translation
- Every legally tricky term highlighted directly on the PDF with an explanation of what it means *in your legal system*
- A chat interface where you can ask questions about any clause in plain language

---

## The Gap Detection Problem

This is the core of why LegalLingo exists.

"At-will employment" in the US means your employer can fire you at any time, for any reason. In Spain, that's illegal — all firings require specific legal cause. In Germany, after 6 months you're protected by the Kündigungsschutzgesetz. Translate the phrase word for word and a Spanish or German speaker reads it and thinks nothing of it. They have no idea they just signed away protections they've had their entire working life.

LegalLingo flags these gaps:

- 🔴 **RED** — concept doesn't exist in your legal system at all
- 🟡 **AMBER** — exists but works very differently from what you're used to

Every flag links to its official source — wicourts.gov, IATE, or uscourts.gov. Nothing is AI-generated guesswork.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Data Sources                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  wicourts.gov   │  │    IATE API     │  │  uscourts.gov   │         │
│  │  EN → ES + DE   │  │   1.4M terms    │  │  EN definitions │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
└───────────┼─────────────────────┼───────────────────┼───────────────────┘
            │ glossary            │                    │ definitions
            ▼                     ▼                    ▼
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  Upload   │───▶│  Extract  │───▶│   Match   │───▶│ Translate │
│ Document  │    │   Text    │    │   Terms   │    │  (Lingo)  │
│           │    │  PDF.js   │    │  5,200+   │    │           │
└───────────┘    └───────────┘    └───────────┘    └─────┬─────┘
  PDF / DOCX     Bounding boxes   Flag RED/AMBER          │
                 per word                          ┌──────┴──────┐
                                                   ▼             ▼
                                            ┌──────────┐  ┌──────────┐
                                            │   Gap    │  │   Chat   │
                                            │Detection │  │          │
                                            │ RED  🔴  │  │ Ask any  │
                                            │ AMBER 🟡 │  │ question │
                                            └──────────┘  └──────────┘
```

| Step | What Actually Happens |
|------|----------------------|
| **Upload** | PDF or DOCX dropped in — lease, employment contract, visa letter |
| **Extract** | PDF.js pulls full text with exact word-level bounding box coordinates |
| **Match** | 5,200+ legal terms from official `.gov` and EU sources scanned against the document |
| **Translate** | Lingo.dev translates the full document with your legal glossary attached — flagged terms are always translated consistently |
| **Gap Detection** | RED and AMBER terms highlighted directly on the PDF page |
| **Chat** | Ask anything about a clause — answers are grounded in your specific document, not generic legal information |

---

## Data Sources

Legal accuracy matters here more than anywhere. Every term definition comes from an authoritative source:

- **[wicourts.gov](https://www.wicourts.gov)** — Official US court interpreter glossaries, used by certified court interpreters. EN → ES and EN → DE.
- **[IATE](https://iate.europa.eu)** — The EU's InterActive Terminology for Europe. 1.4 million entries, 24 languages, built by EU lawyer-linguists.
- **[uscourts.gov](https://www.uscourts.gov/glossary)** — The US Federal Courts official legal glossary. Source of truth for English definitions.

No AI-generated definitions. No Wikipedia. Official sources only.

---

## Getting Started

```bash
git clone https://github.com/Mkn0021/legal-lingo.git
cd legal-lingo
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
LINGODOTDEV_API_KEY=    # Lingo.dev — document translation
OPENAI_API_KEY=         # OpenAI — document chat
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Translation | Lingo.dev SDK |
| Chat | OpenAI GPT-4o-mini |
| PDF Processing | PDF.js |
| Flow Diagram | React Flow |
| Database | libSQL (local SQLite) |

---

## Project Structure

```
legal-lingo/
├── app/
│   ├── page.tsx                  # Homepage
│   └── (scan)/
│       ├── scan/page.tsx         # Main scan interface
│       └── api/
│           ├── process/          # Document processing + translation
│           └── chat/             # Document chat
├── components/
│   ├── homepage/                 # Landing page sections
│   └── scanpage/                 # Scan interface components
│       ├── result-view.tsx       # PDF viewer + highlights
│       ├── chat-handler.tsx      # Chat UI + OpenAI streaming
│       └── multi-step-loader.tsx # Real-time progress via SSE
├── data/
│   └── legal_terms.db            # 5,200 legal terms (SQLite)
├── scripts/
│   └── backfill-translations.ts  # One-time Lingo translation backfill
└── lib/
    ├── db.ts                     # libSQL client
    └── types.ts                  # Shared TypeScript types
```

---

## Roadmap

- [ ] Hindi language support
- [ ] More document types — insurance policies, court notices
- [ ] DOCX export of translated document
- [ ] Mobile responsive scan interface
- [ ] Additional jurisdictions beyond US law

---

## Disclaimer

LegalLingo is not a law firm and does not provide legal advice. Translations and explanations are for informational purposes only. Always consult a qualified lawyer for advice specific to your situation.

---

## Built For

[Lingo.dev Multilingual Hackathon](https://lingo.dev) — March 2026

**Made with 💜 for the 25 million people who deserve to understand what they're signing.**