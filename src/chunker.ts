import fs from "node:fs"

export type Chunk = {
    id: number;
    text: string;
    start_offset: number;
}

export function chunk(
    text: string,
    options: {
        size?: number;
        overlap?: number;
    } = {}
): Chunk[] {
    const { size = 500, overlap = 50 } = options;

    const chunks: Chunk[] = [];

    let startOffset = 0
    for (let i = 0; ; i++) {
        const border = startOffset + size
        const str1 = text.slice(startOffset, border)
        if (!str1) break

        const idx = text.indexOf("。", border)
        const isTextEnd = idx < 0
        const end = isTextEnd ? text.length : idx+ 1

        chunks.push({
            id: i,
            text: str1.concat(text.slice(border, end)),
            start_offset: startOffset
        })

        if (isTextEnd) break

        startOffset = end - overlap
    }

    return chunks
}

// const bocchan = fs.readFileSync("./chunker/data/bocchan.utf8.txt", "utf-8")
// console.log(chunk(bocchan))

