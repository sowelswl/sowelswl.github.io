import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../en/index.html", import.meta.url), "utf8")

test("the English edition uses the same neutral capability positioning", () => {
  assert.match(html, /<html[^>]+lang="en"/)
  assert.match(html, /<h1[^>]*>Quantitative Research &amp; Live Performance Record/)
  assert.match(html, /href="\/assets\/css\/landing\.css\?v=20260817-resume"/)
  assert.match(html, /full-stack quantitative system/i)
  assert.match(html, /live stock-selection and market-timing strategies/i)
  assert.match(html, /AI 2\.0 and RSI iteration/i)
  assert.doesNotMatch(html, /hybrid quantitative and discretionary proprietary trader/i)
  assert.match(html, /AlphaForge/)
  assert.match(html, /AAAI 2025/)
  assert.doesNotMatch(html, /id="ai-workflow"|2027\s*[—-]\s*2028/)
})

test("the English edition carries the same post-2024 research narrative", () => {
  assert.match(html, /solo, zero-to-one/i)
  assert.match(html, /AI 2\.0/i)
  assert.match(html, /vibe coding/i)
  assert.match(html, /RSI-style recursive self-improvement/i)
  assert.match(html, /time-series and discretionary timing/i)
  assert.match(html, /human validation, risk governance, and deployment approval/i)
  assert.doesNotMatch(html, /fully autonomous|partner|team lead/i)
})
test("the English information journey keeps only identity, method, evidence and contact", () => {
  for (const section of ["profile", "method", "performance", "contact"]) {
    assert.match(html, new RegExp(`id="${section}"`))
  }

  assert.ok(html.indexOf('id="profile"') < html.indexOf('id="performance"'))
})

test("the English edition retains live evidence and Chinese navigation", () => {
  assert.match(html, /data-component="performance-teaser"/)
  assert.match(html, /data-cta="hero-live-report"/)
  assert.match(html, /utm_campaign=personal_site_en/)
  assert.match(html, /not personalized investment advice/i)
  assert.match(html, /href="\/"[^>]*hreflang="zh-CN"[^>]*>中文</)
})
