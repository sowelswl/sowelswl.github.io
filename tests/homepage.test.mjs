import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the default homepage leads with a neutral research record instead of a personal brand", async () => {
  const html = await read("index.html")
  const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? ""

  assert.match(html, /<html[^>]+lang="zh-CN"/)
  assert.match(html, /<h1[^>]*>量化研究与实盘记录/)
  assert.match(hero, /全栈量化系统/)
  assert.match(hero, /选股与择时实盘/)
  assert.match(hero, /AI 2\.0与RSI迭代/)
  assert.doesNotMatch(hero, /苏牙品牌|宋伟力肖像|量化与主观结合的自营交易者/)
  assert.match(html, /data-cta="hero-live-report"/)
  assert.match(html, /id="profile"/)
  assert.match(html, /id="method"/)
  assert.match(html, /id="timing-ledger"/)
  assert.match(html, /id="performance"/)
  assert.match(html, /id="suya-talk"/)
  assert.match(html, /id="notes"/)
  assert.match(html, /id="contact"/)
  assert.ok(html.indexOf('id="method"') < html.indexOf('id="performance"'))
  assert.ok(html.indexOf('id="method"') < html.indexOf('id="timing-ledger"'))
  assert.ok(html.indexOf('id="timing-ledger"') < html.indexOf('id="performance"'))
  assert.ok(html.indexOf('id="performance"') < html.indexOf('id="suya-talk"'))
  assert.doesNotMatch(html, /id="ai-workflow"|id="principles"|2026 Q2|2027\s*[—-]\s*2028/)
})

test("homepage aligns the post-2024 research narrative with the resume", async () => {
  const html = await read("index.html")

  assert.match(html, /单人从零到一/)
  assert.match(html, /AI 2\.0/)
  assert.match(html, /Vibe Coding/)
  assert.match(html, /RSI式递归自我改进/)
  assert.match(html, /时序与主观择时/)
  assert.match(html, /独立验证[、、]风险治理[、、]上线审批/)
  assert.doesNotMatch(html, /完全自主进化|全自动闭环|重要合伙人|团队负责人/)
})

test("homepage presents the five-state timing ledger as a cohesive editorial section", async () => {
  const [html, css] = await Promise.all([read("index.html"), read("assets/css/landing.css")])

  assert.match(html, /核心系统[\s\S]*苏牙择时/)
  assert.match(html, /强空[\s\S]*弱空[\s\S]*看平[\s\S]*弱多[\s\S]*强多/)
  assert.match(html, /中证500[\s\S]*沪深300[\s\S]*中证1000[\s\S]*中证2000[\s\S]*上证指数/)
  assert.match(html, /核心研究资产/)
  assert.match(html, /href="\/ledger\/"/)
  assert.match(html, /不公开完整历史序列|不公开[\s\S]*生成规则/)
  assert.match(html, /id="timing-ledger"[\s\S]*class="section-heading section-heading-row"/)
  assert.match(html, /class="timing-ledger-board"/)
  assert.match(css, /\.timing-ledger-board\s*\{[^}]*background:\s*var\(--white\)[^}]*border-radius:\s*22px/s)
  assert.doesNotMatch(css, /\.timing-ledger-board\s*\{[^}]*linear-gradient/s)
  assert.match(css, /\.timing-ledger \.section-heading-row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.3fr\) minmax\(320px, 0\.7fr\)/s)
  assert.match(css, /\.timing-state-scale/)
  assert.match(css, /\.timing-ledger\s*\{[^}]*scroll-margin-top:\s*78px/s)
  assert.match(css, /\.timing-proof-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s)
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.timing-state-scale\s*\{[^}]*repeat\(5, minmax\(0, 1fr\)\)/)
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.timing-proof-grid\s*\{[^}]*grid-template-columns:\s*1fr/s)
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
  for (const field of ["total-return", "total-excess", "max-drawdown", "as-of"]) {
    assert.match(html, new RegExp(`data-performance="${field}"`))
  }
  assert.match(script, /https:\/\/www\.suyainvestments\.com\/api\/performance\/stats\?time_range=all/)
  assert.match(script, /returns\.formatted\.total/)
  assert.match(script, /excess_returns\.formatted\.total/)
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
  assert.match(html, /开放交流[\s\S]*开始投研交流/)
  assert.doesNotMatch(html, /申请投研交流/)
  assert.match(html, /href="\/connect\/research\/"/)
  assert.doesNotMatch(html, /私人投研会员|href="\/connect\/private-research\/"/)
  assert.doesNotMatch(html, /href="\/(?:publications|aboutmeCN)\//)
})

test("homepage includes baseline accessibility, responsive, and metadata support", async () => {
  const [html, css] = await Promise.all([read("index.html"), read("assets/css/landing.css")])

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/)
  assert.match(html, /<meta name="description"/)
  assert.match(html, /<meta property="og:title"/)
  assert.match(html, /href="\/assets\/css\/landing\.css\?v=20260817-resume"/)
  assert.match(html, /class="skip-link"/)
  assert.match(html, /aria-label="主要导航"/)
  assert.match(html, /<main id="main-content"/)
  assert.doesNotMatch(html, /<img(?![^>]*\balt=)[^>]*>/)
  assert.match(css, /:focus-visible/)
  assert.match(css, /\.research-feature,\s*\.research-card\s*\{[^}]*min-width:\s*0;/s)
  assert.match(css, /@media \(max-width: 760px\)/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
})
