import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("the first two sections provide a thirty-second personal profile", () => {
  const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? ""
  const profile = html.match(/<section id="profile"[\s\S]*?<\/section>/)?.[0] ?? ""
  const contact = html.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(hero, /宋伟力/)
  assert.match(hero, /湖南大学/)
  assert.match(hero, /博士研究生/)
  assert.match(hero, /量化与主观结合的自营交易者/)
  assert.match(profile, /3年私募从业经验/)
  assert.match(profile, /独立管理自营资金/)
  assert.match(profile, /我是宋伟力，湖南大学博士，拥有3年私募从业经验/)
  assert.doesNotMatch(profile, /我是宋伟力，湖南大学管理科学与工程博士研究生/)
  assert.match(profile, /苏牙/)
  assert.doesNotMatch(profile, /weilisong@hnu\.edu\.cn/)
  assert.match(contact, /weilisong@hnu\.edu\.cn/)
})

test("the page explains the hybrid method without marketing private relationships", () => {
  const method = html.match(/<section id="method"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(method, /主观[^。；<]*寻找|主观研究/)
  assert.match(method, /量化[^。；<]*子策略/)
  assert.match(method, /策略组合|组合使用/)
  assert.match(method, /尾部风险/)
  assert.doesNotMatch(html, /游资|A9|A10|内部观点/)
})

test("the page leads with verifiable evidence and scoped risk language", () => {
  assert.match(html, /AlphaForge/)
  assert.match(html, /共同作者/)
  assert.match(html, /data-component="performance-teaser"/)
  assert.match(html, /个人自营研究与历史记录/)
  assert.match(html, /不募集资金|不代客理财/)
  assert.doesNotMatch(html, /21\.90%|2\.398|行业平均|千万级别/)
})
