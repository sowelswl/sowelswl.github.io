import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

test("both homepages keep the capability-led hero and restore the portrait inside the about section", async () => {
  for (const page of ["index.html", "en/index.html"]) {
    const html = await readFile(new URL(page, root), "utf8")
    const hero = html.match(/<section class="hero[\s\S]*?<\/section>/)?.[0] ?? ""
    const profile = html.match(/<section id="profile"[\s\S]*?<\/section>/)?.[0] ?? ""

    assert.match(hero, /class="hero-capability-panel"/)
    assert.doesNotMatch(hero, /portrait-picture|weilisong-portrait|\/images\/weilisong\.jpg/)
    assert.match(profile, /class="profile-portrait"/)
    assert.match(profile, /weilisong-portrait-640\.webp 640w/)
    assert.match(profile, /weilisong-portrait-960\.webp 960w/)
    assert.match(profile, /width="960" height="1441"/)
  }

  const css = await readFile(new URL("assets/css/landing.css", root), "utf8")
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.profile-identity\s*\{[^}]*order:\s*-1/s)
})

test("responsive WebP portraits stay within the homepage performance budget", async () => {
  const small = await stat(new URL("images/weilisong-portrait-640.webp", root))
  const large = await stat(new URL("images/weilisong-portrait-960.webp", root))

  assert.ok(small.size < 150_000, `640px portrait is ${small.size} bytes`)
  assert.ok(large.size < 260_000, `960px portrait is ${large.size} bytes`)
  assert.ok(small.size < large.size)
})
