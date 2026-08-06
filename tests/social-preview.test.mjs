import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root))
}

function pngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex")
  assert.equal(signature, "89504e470d0a1a0a")
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  }
}

test("public pages publish complete large-card social metadata", async () => {
  const pages = [
    ["index.html", "og-home.png", "宋伟力，主观交易者与量化研究者"],
    ["en/index.html", "og-home.png", "Weili Song, discretionary trader and quantitative researcher"],
    ["notes/index.html", "og-home.png", "宋伟力的文章与复盘"],
    ["notes/quant-to-discretionary/index.html", "og-quant-to-discretionary.png", "为什么我从个人量化转向主观交易加 LLM"],
    ["notes/ai-workflow/index.html", "og-ai-workflow.png", "从 GPT-3 Completion 到 Agentic Coding"]
  ]

  for (const [path, image, alt] of pages) {
    const html = (await read(path)).toString("utf8")
    const imageUrl = `https://weilisong.com/images/social/${image}`

    assert.match(html, new RegExp(`<meta property="og:image" content="${imageUrl.replaceAll(".", "\\.")}">`))
    assert.match(html, /<meta property="og:image:width" content="1200">/)
    assert.match(html, /<meta property="og:image:height" content="630">/)
    assert.match(html, new RegExp(`<meta property="og:image:alt" content="${alt}">`))
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/)
    assert.match(html, new RegExp(`<meta name="twitter:image" content="${imageUrl.replaceAll(".", "\\.")}">`))
  }
})

test("social preview PNGs use the platform-standard 1200 by 630 canvas", async () => {
  for (const name of ["og-home.png", "og-quant-to-discretionary.png", "og-ai-workflow.png"]) {
    const dimensions = pngDimensions(await read(`images/social/${name}`))
    assert.deepEqual(dimensions, { width: 1200, height: 630 })
  }
})

test("editable SVG sources remain paired with every generated social preview", async () => {
  for (const name of ["og-home.svg", "og-quant-to-discretionary.svg", "og-ai-workflow.svg"]) {
    const svg = (await read(`images/social/${name}`)).toString("utf8")
    assert.match(svg, /<svg[^>]*width="1200"[^>]*height="630"/)
    assert.match(svg, /宋伟力|Weili Song/)
  }
})
