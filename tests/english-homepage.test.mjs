import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../en/index.html", import.meta.url), "utf8")

test("the English edition presents the same personal identity as the Chinese homepage", () => {
  assert.match(html, /<html[^>]+lang="en"/)
  assert.match(html, /<h1[^>]*>[^<]*Weili Song/)
  assert.match(html, /Hunan University/)
  assert.match(html, /PhD candidate/i)
  assert.match(html, /3 years.*private (?:fund|investment)/is)
  assert.match(html, /discretionary trading/i)
  assert.match(html, /LLM|AI-assisted/i)
  assert.match(html, /independently manage|proprietary capital/i)
  assert.doesNotMatch(html, /Quantitative research,<br><em>tested in live markets/)
})
test("the English information journey stays personal before performance", () => {
  for (const section of ["profile", "experience", "research", "performance", "principles", "contact"]) {
    assert.match(html, new RegExp(`id="${section}"`))
  }

  assert.ok(html.indexOf('id="profile"') < html.indexOf('id="performance"'))
  assert.match(html, /2023\s*[—-]\s*Nov 2025/)
  assert.match(html, /pivot to discretionary trading/i)
  assert.match(html, /Dec 2025\s*[—-]\s*2026/)
  assert.match(html, /AlphaForge/)
  assert.match(html, /AAAI 2025/)
})

test("the English edition retains live evidence, primary principles, and Chinese navigation", () => {
  assert.match(html, /data-component="performance-teaser"/)
  assert.match(html, /data-cta="hero-live-report"/)
  assert.match(html, /utm_campaign=personal_site_en/)
  assert.match(html, /Warren Buffett/)
  assert.match(html, /John Bogle/)
  assert.match(html, /Howard Marks/)
  assert.match(html, /not personalized investment advice/i)
  assert.match(html, /href="\/"[^>]*hreflang="zh-CN"[^>]*>中文</)
})
