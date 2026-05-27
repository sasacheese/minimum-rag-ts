import "dotenv/config"
import * as fs from "fs"
import { openai } from "./openai"

type EmbeddedChunks = {
    id: number;
    text: string;
    start_offset: number;
    vector: number[]
}

function cosineSim(a: number[], b: number[]): number {
    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
        const ai = a[i]
        const bi = b[i]
        if (ai === undefined || bi === undefined) continue
        dot += ai * bi
        normA += ai * ai
        normB += bi * bi
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function main() {
    const query = process.argv[2]
    if (!query) {
        console.error("Usage: npm run search -- <query>")
        process.exit(1)
    }

    // STEP1: embeddings.jsonl を読み込む
    const lines = fs.readFileSync("./output/embeddings.jsonl", "utf-8").split("\n")
    const chunks: EmbeddedChunks[] = lines.map(l => JSON.parse(l))

    // STEP2: クエリをembedding
    const queryRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
    })
    const queryVec = queryRes.data[0]?.embedding ?? []

    // STEP3: 各チャンクとクエリのコサイン類似度比較
    const scores = chunks.map(c => ({
        ...c,
        score: cosineSim(queryVec, c.vector)
    }))

    // STEP4: 上位5件を表示
    scores.sort((a, b) => b.score - a.score)
    const top5 = scores.slice(0, 5)
    console.log(`\nQuery: ${query}\n`)
    top5.forEach((c, i) => {
        console.log(`--- Rank ${i + 1} (score: ${c.score.toFixed(4)}, chunk #${c.id}) ---`)
        console.log(c.text.slice(0, 200) + "...")
        console.log()
    })
}

main().catch(console.error)