import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("Chinese is the default homepage and English remains available as a secondary edition", async () => {
  const [chinese, english] = await Promise.all([read("index.html"), read("en/index.html")])

  assert.match(chinese, /<html[^>]+lang="zh-CN"/)
  assert.match(chinese, /href="\/en\/"[^>]+hreflang="en"[^>]*>English<\/a>/)
  assert.match(english, /<html[^>]+lang="en"/)
  assert.match(english, /href="\/"[^>]+hreflang="zh-CN"[^>]*>中文<\/a>/)
})

test("Chinese homepage shares the live summary without restoring stale claims", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/js/performance-teaser.js")])

  assert.match(html, /data-component="performance-teaser"/)
  assert.match(html, /src="\/assets\/js\/performance-teaser\.js\?v=20260817-identity"[^>]*defer/)
  assert.match(html, /时间加权收益/)
  assert.match(html, /中证500/)
  assert.match(html, /https:\/\/www\.suyainvestments\.com\//)
  assert.match(script, /document\.documentElement\.lang\.startsWith\("zh"\)/)
  assert.match(script, /"zh-CN"/)
  assert.doesNotMatch(html, /过去\s*10\s*个月|21\.90%|2\.398|行业平均|千万级别/)
})

test("legacy Chinese URLs redirect to the default Chinese homepage", async () => {
  const redirects = await Promise.all([read("zh/index.html"), read("aboutmeCN/index.html")])

  for (const redirect of redirects) {
    assert.match(redirect, /url=\//i)
    assert.match(redirect, /href="\/"/)
    assert.doesNotMatch(redirect, /21\.90%|行业平均|千万级别/)
  }
})
