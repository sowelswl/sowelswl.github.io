import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

test("both homepages use a responsive portrait with an accessible JPEG fallback", async () => {
  for (const page of ["index.html", "en/index.html"]) {
    const html = await readFile(new URL(page, root), "utf8")

    assert.match(html, /<picture class="portrait-picture">/)
    assert.match(html, /weilisong-portrait-640\.webp 640w/)
    assert.match(html, /weilisong-portrait-960\.webp 960w/)
    assert.match(html, /sizes="\(max-width: 760px\) 86vw, 430px"/)
    assert.match(html, /fetchpriority="high"/)
    assert.match(html, /<img[^>]+src="\/images\/weilisong\.jpg"[^>]+alt="[^"]+"/)
  }
})

test("responsive WebP portraits stay within the homepage performance budget", async () => {
  const small = await stat(new URL("images/weilisong-portrait-640.webp", root))
  const large = await stat(new URL("images/weilisong-portrait-960.webp", root))

  assert.ok(small.size < 150_000, `640px portrait is ${small.size} bytes`)
  assert.ok(large.size < 260_000, `960px portrait is ${large.size} bytes`)
  assert.ok(small.size < large.size)
})
