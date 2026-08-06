import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("public editorial pages advertise the canonical Atom feed", async () => {
  const pages = await Promise.all([
    read("index.html"),
    read("notes/index.html"),
    read("notes/quant-to-discretionary/index.html"),
    read("notes/ai-workflow/index.html")
  ])

  for (const html of pages) {
    assert.match(html, /<link rel="alternate" type="application\/atom\+xml" title="宋伟力的文章与复盘" href="https:\/\/weilisong\.com\/feed\.xml">/)
  }
})

test("the notes archive offers a visible subscription path", async () => {
  const html = await read("notes/index.html")

  assert.match(html, /href="\/feed\.xml"/)
  assert.match(html, /订阅更新/)
})

test("the Atom feed publishes stable metadata and both foundation articles", async () => {
  const feed = await read("feed.xml")

  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom" xml:lang="zh-CN">/)
  assert.match(feed, /<title>宋伟力的文章与复盘<\/title>/)
  assert.match(feed, /<id>https:\/\/weilisong\.com\/feed\.xml<\/id>/)
  assert.match(feed, /rel="self" type="application\/atom\+xml"/)
  assert.match(feed, /<name>宋伟力<\/name>/)
  assert.match(feed, /<updated>2026-08-06T00:00:00\+08:00<\/updated>/)

  const entries = feed.match(/<entry>/g) ?? []
  assert.equal(entries.length, 2)
  assert.match(feed, /https:\/\/weilisong\.com\/notes\/quant-to-discretionary\//)
  assert.match(feed, /为什么我从个人量化转向主观交易 \+ LLM/)
  assert.match(feed, /https:\/\/weilisong\.com\/notes\/ai-workflow\//)
  assert.match(feed, /从 GPT-3 Completion 到 Agentic Coding/)
})

test("robots and sitemap make the feed and notes discoverable", async () => {
  const [robots, sitemap] = await Promise.all([read("robots.txt"), read("sitemap.xml")])

  assert.match(robots, /Sitemap: https:\/\/weilisong\.com\/sitemap\.xml/)
  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\//)
  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\/quant-to-discretionary\//)
  assert.match(sitemap, /https:\/\/weilisong\.com\/notes\/ai-workflow\//)
})
