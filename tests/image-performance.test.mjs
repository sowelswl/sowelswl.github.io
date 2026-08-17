import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

test("both homepages replace the personal portrait with a capability panel", async () => {
  for (const page of ["index.html", "en/index.html"]) {
    const html = await readFile(new URL(page, root), "utf8")

    assert.match(html, /class="hero-capability-panel"/)
    assert.doesNotMatch(html, /portrait-picture|weilisong-portrait|\/images\/weilisong\.jpg/)
  }
})

test("responsive WebP portraits stay within the homepage performance budget", async () => {
  const small = await stat(new URL("images/weilisong-portrait-640.webp", root))
  const large = await stat(new URL("images/weilisong-portrait-960.webp", root))

  assert.ok(small.size < 150_000, `640px portrait is ${small.size} bytes`)
  assert.ok(large.size < 260_000, `960px portrait is ${large.size} bytes`)
  assert.ok(small.size < large.size)
})
