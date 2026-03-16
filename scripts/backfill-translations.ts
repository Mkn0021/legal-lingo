// Run: LINGODOTDEV_API_KEY=$(grep LINGODOTDEV_API_KEY .env | cut -d '=' -f2) npx tsx scripts/backfill-translations.ts

import { db } from "@/lib/db"
import { LingoDotDevEngine } from "lingo.dev/sdk"

const BATCH_SIZE = 50

interface TermRow {
    id: number
    english_term: string
}

async function getMissingTerms(): Promise<TermRow[]> {
    const result = await db.execute({
        sql: `
      SELECT id, english_term 
      FROM legal_terms 
      WHERE translation_es IS NULL OR translation_de IS NULL
      ORDER BY id
    `,
        args: [],
    })

    return result.rows.map((row) => ({
        id: row.id as number,
        english_term: row.english_term as string,
    }))
}

async function translateBatch(
    terms: TermRow[],
    lingo: LingoDotDevEngine
): Promise<{
    es: Record<string, string>
    de: Record<string, string>
}> {
    const input: Record<string, string> = {}
    for (const term of terms) {
        input[`t${term.id}`] = term.english_term
    }

    const [es, de] = await Promise.all([
        lingo.localizeObject(input, {
            sourceLocale: "en",
            targetLocale: "es",
        }),
        lingo.localizeObject(input, {
            sourceLocale: "en",
            targetLocale: "de",
        }),
    ])

    return { es, de }
}

async function saveBatch(
    terms: TermRow[],
    translations: { es: Record<string, string>; de: Record<string, string> }
) {
    for (const term of terms) {
        const key = `t${term.id}`
        const es = translations.es[key] ?? null
        const de = translations.de[key] ?? null

        if (es || de) {
            await db.execute({
                sql: `
          UPDATE legal_terms
          SET
            translation_es = COALESCE(translation_es, ?),
            translation_de = COALESCE(translation_de, ?)
          WHERE id = ?
        `,
                args: [es, de, term.id],
            })
        }
    }
}

async function main() {
    if (!process.env.LINGODOTDEV_API_KEY) {
        console.error("❌ LINGODOTDEV_API_KEY not set")
        process.exit(1)
    }

    const lingo = new LingoDotDevEngine({
        apiKey: process.env.LINGODOTDEV_API_KEY!,
    })

    const missing = await getMissingTerms()
    const total = missing.length
    console.log(`📋 ${total} terms need translation\n`)

    if (total === 0) {
        console.log("✅ All terms already translated!")
        return
    }

    let completed = 0
    const failed: number[] = []
    const totalBatches = Math.ceil(total / BATCH_SIZE)

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE)
        const batchNum = Math.floor(i / BATCH_SIZE) + 1

        process.stdout.write(
            `Batch ${batchNum}/${totalBatches} — terms ${i + 1}–${Math.min(i + BATCH_SIZE, total)}... `
        )

        try {
            const translations = await translateBatch(batch, lingo)
            await saveBatch(batch, translations)
            completed += batch.length
            console.log(`✅ (${completed}/${total})`)
        } catch (err) {
            console.log(`❌ ${err}`)
            failed.push(batchNum)
        }
    }

    console.log(`\n🎉 Done. ${completed}/${total} terms translated.`)
    if (failed.length > 0) {
        console.log(`⚠️  Failed batches: ${failed.join(", ")} — re-run to retry.`)
    }
}

main().catch(console.error)