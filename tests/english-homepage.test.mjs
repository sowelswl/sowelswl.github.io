import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../en/index.html", import.meta.url), "utf8")

test("the English edition is a concise international credibility page", () => {
  assert.match(html, /<html[^>]+lang="en"/)
  assert.match(html, /<h1[^>]*>[^<]*Weili Song/)
  assert.match(html, /Hunan University/)
  assert.match(html, /PhD candidate/i)
  assert.match(html, /3 years.*private (?:fund|investment)/is)
  assert.match(html, /hybrid quantitative and discretionary proprietary trader/i)
  assert.match(html, /independently manage|proprietary capital/i)
  assert.match(html, /AlphaForge/)
  assert.match(html, /AAAI 2025/)
  assert.doesNotMatch(html, /id="ai-workflow"|2027\s*[—-]\s*2028/)
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
