# minimum-rag-ts

RAGの基本構成を理解するための最小のRAG（TypeScript）。

`data/bocchan.utf8.txt`をチャンク化し、embedding で検索して LLM に回答させる。

## セットアップ

```bash
npm install
```

`.env` に OpenAI API キーを設定する。

```
OPENAI_API_KEY=sk-...
```

## 使い方

3 ステップを順に実行する。

### 1. ingest — テキストをベクトル化して保存

```bash
npm run ingest
```

- `data/bocchan.utf8.txt` をチャンク分割
- 各チャンクを `text-embedding-3-small` で embedding
- 結果を `output/embeddings.jsonl` に保存

初回のみ実行すればよい（元テキストを変えたときだけ再実行）。

### 2. search — 類似チャンクを検索

```bash
npm run search -- "校長先生のセリフがある場面は？"
```

- クエリを embedding し、全チャンクとコサイン類似度を計算
- 上位 5 件を表示
- `output/top5.jsonl` と `output/query.txt` を書き出す

### 3. rag — 検索結果をもとに LLM が回答

```bash
npm run rag
```

- `output/top5.jsonl` の資料と `output/query.txt` の質問をプロンプトに渡す
- `gpt-4o-mini` が回答を生成

## 実行例

```bash
npm run search -- "校長先生のセリフがある場面は？"
npm run rag
```

```
=== Answer ===
校長先生のセリフがある場面は、資料の中の以下の部分です：

「まあ精出して勉強してくれと云って、恭《うやうや》しく大きな印の捺《おさ》った、辞令を渡《わた》した。」

このセリフは、校長が主人公に対して何かを伝えようとしているときにあります。具体的には、校長が辞令を渡しながら、学業に励むようにと励ましの言葉をかけている場面です。
```

## ファイル構成

| パス | 内容 |
|------|------|
| `src/ingest.ts` | チャンク化 + embedding |
| `src/search.ts` | ベクトル検索 |
| `src/rag.ts` | LLM による回答生成 |
| `output/embeddings.jsonl` | 全チャンクの embedding（ingest の出力） |
| `output/top5.jsonl` | 検索上位 5 件（search の出力） |
| `output/query.txt` | 直近の検索クエリ（search の出力） |
