import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the Chinese homepage carries the new AI workflow and personal belief from GitHub Profile", async () => {
  const html = await read("index.html")

  assert.match(html, /id="ai-workflow"/)
  assert.match(html, /智能的溢出/)
  assert.match(html, /Expertise/)
  assert.match(html, /Master/)
  assert.match(html, /2022年下半年/)
  assert.match(html, /GPT-3 Completion/)
  assert.match(html, /2022\s*[—-]\s*2024/)
  assert.match(html, /Claude Chat.*GPT Chat/s)
  assert.match(html, /2024/)
  assert.match(html, /Cursor|LLM-driven IDE/)
  assert.match(html, /2025年中至今/)
  assert.match(html, /Claude Code/)
  assert.match(html, /Codex/)
  assert.match(html, /Agent 系统|Agent系统/)
})
test("the Chinese homepage makes current trade-offs and future plans explicit", async () => {
  const html = await read("index.html")

  assert.match(html, /个人量化难以持续跑赢主观交易/)
  assert.match(html, /2027\s*[—-]\s*2028/)
  assert.match(html, /商品/)
  assert.match(html, /可转债/)
  assert.match(html, /海外权益/)
  assert.match(html, /宏观\s*\/\s*其他市场/)
  assert.match(html, />0%<\/strong>/)
  assert.match(html, /2027年之前不涉足宏观研究或其他市场/)
  assert.match(html, /QQ：405113793/)
})

test("the English edition mirrors the expanded GitHub Profile story", async () => {
  const html = await read("en/index.html")

  assert.match(html, /id="ai-workflow"/)
  assert.match(html, /intelligence overflow/i)
  assert.match(html, /Expertise/)
  assert.match(html, /Master/)
  assert.match(html, /GPT-3 Completion/)
  assert.match(html, /Claude Chat.*GPT Chat/s)
  assert.match(html, /Cursor|LLM-driven IDE/)
  assert.match(html, /Claude Code/)
  assert.match(html, /Codex/)
  assert.match(html, /2027\s*[—-]\s*2028/)
  assert.match(html, /commodities/i)
  assert.match(html, /convertible bonds/i)
  assert.match(html, /overseas equities/i)
  assert.match(html, /QQ: 405113793/)
})
