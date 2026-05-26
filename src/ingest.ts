import * as fs from "fs"
import { chunk } from "./chunker"

async function main() {
  // Step 1: テキスト読み込み
  const text = fs.readFileSync("./data/bocchan.utf8.txt", "utf-8")

  // Step 2: チャンク化
  const chunks = chunk(text)
  console.log(`${chunks.length} chunks created`)

  // Step 3: TODO 各チャンクを OpenAI embedding API でベクトル化
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const embedded = []
  // for (const c of chunks) {
  //   const res = await openai.embeddings.create({
  //     model: "text-embedding-3-small",
  //     input: c.text,
  //   })
  //   embedded.push({ ...c, vector: res.data[0].embedding })
  // }

  // Step 4: TODO embeddings.jsonl に保存（1行1チャンクのJSON）
  // const lines = embedded.map(e => JSON.stringify(e)).join("\n")
  // fs.writeFileSync("./output/embeddings.jsonl", lines)
}

main()
