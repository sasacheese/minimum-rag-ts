import "dotenv/config"
import * as fs from "fs"
import { chunk } from "./chunker"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function embedChunk(text: string): Promise<number[]> {
    const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })
    return res.data[0]?.embedding ?? []
}

async function main() {
  // Step 1: テキスト読み込み
  const text = fs.readFileSync("./data/bocchan.utf8.txt", "utf-8")

  // Step 2: チャンク化
  const chunks = chunk(text)
  console.log(`${chunks.length} chunks created`)

  // Step 3: 各チャンクを OpenAI embedding API でベクトル化
  const results = []
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]
    if (!c?.text) continue
    const vector = await embedChunk(c.text)
    results.push({ ...c, vector })
    console.log(`[${i + 1}/${chunks.length}] embedded chunk ${c.id}`)
  }

  // Step 4: embeddings.jsonl に保存（1行1チャンクのJSON）
  const lines = results.map(e => JSON.stringify(e)).join("\n")
  fs.writeFileSync("./output/embeddings.jsonl", lines)
  console.log(`Saved to ./output/embeddings.jsonl`)
}

main()
