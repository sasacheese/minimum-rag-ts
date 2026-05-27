import "dotenv/config"
import * as fs from "fs"
import { openai } from "./openai"

type Candidates = {
    id: number;
    text: string;
    start_offset: number;
    vector: number[];
    score: number;
}

async function main() {
    const query = fs.readFileSync("./output/query.txt", "utf-8").trim()
    const lines = fs.readFileSync("./output/top5.jsonl", "utf-8").split("\n")
    const candidates: Candidates[] = lines.map(l => JSON.parse(l))

    const prompt = `以下の資料を参考に質問に答えてください。
    
    [資料]${candidates.map(c => `[id:${c.id}, score:${c.score}, start_offset:${c.start_offset}]: ${c.text}`).join("\n----\n")}

    [質問]${query}
    `

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    })

    console.log("\n=== Answer ===")
    console.log(res.choices[0]?.message.content)
}

main().catch(console.error)