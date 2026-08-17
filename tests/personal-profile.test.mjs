import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const html = await readFile(new URL("../index.html", import.meta.url), "utf8")

test("the first two sections introduce Weili Song clearly while keeping capabilities primary", () => {
  const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? ""
  const profile = html.match(/<section id="profile"[\s\S]*?<\/section>/)?.[0] ?? ""
  const contact = html.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(hero, /量化研究与实盘记录/)
  assert.doesNotMatch(hero, /宋伟力肖像|苏牙品牌/)
  assert.match(profile, /01 — 关于宋伟力/)
  assert.match(profile, /我是宋伟力/)
  assert.match(profile, /湖南大学管理科学与工程博士研究生/)
  assert.match(profile, /澳大利亚国立大学统计学硕士/)
  assert.match(profile, /曾在量化私募从事策略研究/)
  assert.match(profile, /AlphaForge共同作者（作者列表第2位）/)
  assert.match(profile, /class="profile-portrait"/)
  assert.match(profile, /alt="宋伟力个人照片"/)
  assert.match(profile, /数据层、因子层、模型层、组合优化、风险、交易、监控与归因/)
  assert.match(profile, /横截面选股、时序与主观择时/)
  assert.match(profile, /AI 2\.0与Vibe Coding/)
  assert.match(profile, /RSI式递归自我改进/)
  assert.match(profile, /时序与主观择时/)
  assert.match(profile, /个人自营账户/)
  assert.doesNotMatch(profile, /独立管理自营资金|苏牙背后|重要合伙人|团队负责人/)
  assert.doesNotMatch(profile, /weilisong@hnu\.edu\.cn/)
  assert.match(contact, /weilisong@hnu\.edu\.cn/)
})

test("the page explains the aligned quantitative method without marketing private relationships", () => {
  const method = html.match(/<section id="method"[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(method, /全栈量化系统/)
  assert.match(method, /选股、时序与主观择时/)
  assert.match(method, /AI 2\.0与RSI迭代/)
  assert.match(method, /样本外检验|风险治理/)
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
