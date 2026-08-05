import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the default homepage introduces Weili before presenting investment evidence", async () => {
  const html = await read("index.html")

  assert.match(html, /<html[^>]+lang="zh-CN"/)
  assert.match(html, /<h1[^>]*>[^<]*宋伟力/)
  assert.match(html, /湖南大学/)
  assert.match(html, /管理科学与工程博士研究生/)
  assert.match(html, /主观交易/)
  assert.match(html, /LLM|AI 辅助/)
  assert.match(html, /3年私募从业经验/)
  assert.match(html, /href="#profile"/)
  assert.match(html, /href="#performance"/)
  assert.match(html, /id="profile"/)
  assert.match(html, /id="experience"/)
  assert.match(html, /id="performance"/)
  assert.match(html, /id="research"/)
  assert.match(html, /id="principles"/)
  assert.match(html, /id="contact"/)
  assert.ok(html.indexOf('id="profile"') < html.indexOf('id="performance"'))
})

test("homepage promotes the live report without freezing performance claims", async () => {
  const html = await read("index.html")

  assert.match(html, /data-component="performance-teaser"/)
  assert.match(html, /时间加权收益/)
  assert.match(html, /中证500/)
  assert.ok((html.match(/https:\/\/www\.suyainvestments\.com\//g) ?? []).length >= 2)
  assert.doesNotMatch(html, /Over the past 10 months|21\.90%|2\.398|industry average/i)
})

test("performance teaser progressively loads the privacy-safe live summary", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/js/performance-teaser.js")])

  assert.match(html, /src="\/assets\/js\/performance-teaser\.js"[^>]*defer/)
  for (const field of ["annualized-return", "annualized-excess", "max-drawdown", "as-of"]) {
    assert.match(html, new RegExp(`data-performance="${field}"`))
  }
  assert.match(script, /https:\/\/www\.suyainvestments\.com\/api\/performance\/stats\?time_range=all/)
  assert.match(script, /returns\.formatted\.annualized/)
  assert.match(script, /excess_returns\.formatted\.annualized/)
  assert.match(script, /risk_metrics\.formatted\.max_drawdown/)
  assert.match(script, /\.textContent\s*=/)
  assert.match(script, /dataset\.status\s*=\s*"fallback"/)
  assert.doesNotMatch(script, /investor_name|INVESTOR_NAME/)
})

test("homepage keeps research authority and collaboration paths visible", async () => {
  const html = await read("index.html")

  assert.match(html, /AlphaForge/)
  assert.match(html, /https:\/\/arxiv\.org\/abs\/2406\.18394/)
  assert.match(html, /https:\/\/ojs\.aaai\.org\/index\.php\/AAAI\/article\/view\/33365/)
  assert.match(html, /mailto:weilisong@hnu\.edu\.cn/)
  assert.match(html, /量化投资研究/)
  assert.match(html, /行业合作/)
  assert.doesNotMatch(html, /href="\/(?:publications|aboutmeCN)\//)
})

test("homepage includes baseline accessibility, responsive, and metadata support", async () => {
  const [html, css] = await Promise.all([read("index.html"), read("assets/css/landing.css")])

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/)
  assert.match(html, /<meta name="description"/)
  assert.match(html, /<meta property="og:title"/)
  assert.match(html, /class="skip-link"/)
  assert.match(html, /aria-label="主要导航"/)
  assert.match(html, /<main id="main-content"/)
  assert.doesNotMatch(html, /<img(?![^>]*\balt=)[^>]*>/)
  assert.match(css, /:focus-visible/)
  assert.match(css, /\.research-feature,\s*\.research-card\s*\{[^}]*min-width:\s*0;/s)
  assert.match(css, /@media \(max-width: 760px\)/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
})
