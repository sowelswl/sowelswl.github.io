import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the homepage turns the expanded profile into a durable notes path", async () => {
  const html = await read("index.html")

  assert.match(html, /id="notes"/)
  assert.match(html, /href="\/notes\/quant-to-discretionary\/"/)
  assert.match(html, /href="\/notes\/ai-workflow\/"/)
  assert.match(html, /href="\/notes\/"/)
  assert.ok(html.indexOf('id="notes"') < html.indexOf('id="performance"'))
})

test("the notes archive exposes dated, authored, canonical articles", async () => {
  const html = await read("notes/index.html")

  assert.match(html, /<title>文章与复盘 — 宋伟力<\/title>/)
  assert.match(html, /href="https:\/\/weilisong\.com\/notes\/"/)
  assert.match(html, /为什么我从个人量化转向主观交易 \+ LLM/)
  assert.match(html, /从 GPT-3 Completion 到 Agentic Coding/)
  assert.match(html, /宋伟力/)
  assert.match(html, /<time[^>]*datetime="2026-08-06"/)
})

test("the trading pivot note preserves the GitHub Profile claims and limits", async () => {
  const html = await read("notes/quant-to-discretionary/index.html")

  assert.match(html, /<link rel="canonical" href="https:\/\/weilisong\.com\/notes\/quant-to-discretionary\/">/)
  assert.match(html, /个人量化难以持续跑赢主观交易/)
  assert.match(html, /不是否定量化/)
  assert.match(html, /主观交易 \+ AI 辅助/)
  assert.match(html, /80%/)
  assert.match(html, /量化研究/)
  assert.match(html, /20%/)
  assert.match(html, /不构成投资建议/)
  assert.match(html, /data-note-author="宋伟力"/)
})

test("the AI workflow note documents the complete progression without inflated claims", async () => {
  const html = await read("notes/ai-workflow/index.html")

  assert.match(html, /<link rel="canonical" href="https:\/\/weilisong\.com\/notes\/ai-workflow\/">/)
  assert.match(html, /GPT-3 Completion/)
  assert.match(html, /Claude Chat.*GPT Chat/s)
  assert.match(html, /Cursor/)
  assert.match(html, /Claude Code/)
  assert.match(html, /Codex/)
  assert.match(html, /Agent Systems/)
  assert.match(html, /智能的溢出/)
  assert.match(html, /Expertise/)
  assert.match(html, /Master/)
  assert.match(html, /data-note-author="宋伟力"/)
})

test("sitemap includes the public notes but no legacy routes", async () => {
  const sitemap = await read("sitemap.xml")

  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\//)
  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\/quant-to-discretionary\//)
  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\/ai-workflow\//)
  assert.doesNotMatch(sitemap, /aboutmeCN|\/zh\//)
})

