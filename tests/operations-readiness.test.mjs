import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("repository guidance matches the capability-led positioning", async () => {
  const [readme, operations, benchmarks] = await Promise.all([
    read("README.md"),
    read("CONTENT_OPERATIONS.md"),
    read("BENCHMARK_RESEARCH.md"),
  ])

  for (const source of [readme, operations, benchmarks]) {
    assert.match(source, /LLM|AI/)
    assert.match(source, /量化研究|quantitative research/i)
    assert.doesNotMatch(source, /21\.90%|2\.398|Quantitative research, tested in live markets/)
  }

  assert.match(readme, /全栈量化系统/)
  assert.match(readme, /选股与择时模型/)
  assert.match(operations, /能力：|quantitative capabilities/i)
  assert.doesNotMatch(operations, /Visitor → personal profile/)
  assert.match(operations, /月度复盘|monthly/i)
  assert.match(operations, /季度研究|quarterly/i)
})

test("current positioning invites peer exchange without employment framing", async () => {
  const [chinese, english, research, operations] = await Promise.all([
    read("index.html"),
    read("en/index.html"),
    read("connect/research/index.html"),
    read("CONTENT_OPERATIONS.md"),
  ])

  assert.match(chinese, /有真实交易或研究经验、愿意进行浅合作与持续交流的人/)
  assert.match(english, /lightweight, sustained exchange with traders and researchers/)
  assert.doesNotMatch(chinese, /不寻求工作|工作机会|求职/)
  assert.doesNotMatch(english, /seeking employment|job opportunit|recruit/i)
  assert.doesNotMatch(research, /求职|工作机会/)
  assert.doesNotMatch(operations, /recruiter|employment|job opportunit/i)
})

test("search engines receive canonical public routes", async () => {
  const [robots, sitemap] = await Promise.all([
    read("robots.txt"),
    read("sitemap.xml"),
  ])

  assert.match(robots, /User-agent:\s*\*/)
  assert.match(robots, /Allow:\s*\//)
  assert.match(robots, /Sitemap:\s*https:\/\/weilisong\.com\/sitemap\.xml/)
  assert.match(sitemap, /<loc>https:\/\/weilisong\.com\/<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/weilisong\.com\/en\/<\/loc>/)
  assert.doesNotMatch(sitemap, /aboutmeCN|\/zh\//)
})

test("live-report calls to action identify the personal site as their source", async () => {
  const html = await read("index.html")
  const campaign = "utm_source=weilisong.com&amp;utm_medium=referral&amp;utm_campaign=personal_site"

  assert.ok((html.match(new RegExp(campaign, "g")) ?? []).length >= 2)
  assert.match(html, /data-cta="hero-live-report"/)
  assert.match(html, /data-cta="performance-live-report"/)
})

test("legacy inherited pages are excluded from the public GitHub Pages build", async () => {
  const config = await read("_config.yml")

  for (const legacyPath of [
    "_config_bak.yml",
    "backup",
    "blogs",
    "awards.md",
    "blogs.md",
    "hobbies.md",
    "publications.md",
    "teams.md",
    "file/404.md",
    "file/CV-HanlinCAI.pdf",
    "file/CV-IoE.pdf",
    "file/awards-zh.md",
    "file/publications-zh.md",
  ]) {
    assert.match(config, new RegExp(`- ${legacyPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`))
  }
})

test("the public 404 page returns visitors to the current personal profile", async () => {
  const html = await read("404.html")

  assert.match(html, /<meta name="robots" content="noindex, follow">/)
  assert.match(html, /宋伟力/)
  assert.match(html, /href="\/"/)
  assert.doesNotMatch(html, /Hanlin|caihanlin|hanlin\.cai/i)
})
