import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("the first two sections provide a thirty-second personal profile", () => {
  const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? ""
  const profile = html.match(/<section id="profile"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(hero, /宋伟力/)
  assert.match(hero, /湖南大学/)
  assert.match(hero, /博士研究生/)
  assert.match(hero, /主观交易/)
  assert.match(hero, /AI|LLM/)
  assert.match(profile, /3年私募从业经验/)
  assert.match(profile, /独立管理自营资金/)
  assert.match(profile, /量化研究/)
  assert.match(profile, /weilisong@hnu\.edu\.cn/)
})

test("the page turns verified experience into scan-friendly milestones", () => {
  assert.match(html, /2023\s*[—-]\s*2025\.11/)
  assert.match(html, /量化阶段/)
  assert.match(html, /2025\.11/)
  assert.match(html, /转向主观交易/)
  assert.match(html, /2025\.12\s*[—-]\s*2026/)
  assert.match(html, /LLM 辅助交易/)
  assert.match(html, /AlphaForge/)
  assert.match(html, /共同作者/)
  assert.match(html, /88\s*\/\s*2664/)
  assert.match(html, /23\s*\/\s*2064/)
  assert.doesNotMatch(html, /21\.90%|2\.398|行业平均|千万级别/)
})

test("investment principles cite primary masters without becoming personalized advice", () => {
  assert.match(html, /沃伦·巴菲特/)
  assert.match(html, /约翰·博格/)
  assert.match(html, /霍华德·马克斯/)
  assert.match(html, /https:\/\/www\.berkshirehathaway\.com\/letters\/2013ltr\.pdf/)
  assert.match(html, /https:\/\/corporate\.vanguard\.com\//)
  assert.match(html, /https:\/\/www\.oaktreecapital\.com\//)
  assert.match(html, /不构成个性化投资建议/)
})
