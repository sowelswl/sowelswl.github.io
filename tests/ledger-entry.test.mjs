import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

test("the personal site routes non-GitHub readers to the public ledger frontend", async () => {
  const [chinese, english, redirect, sitemap] = await Promise.all([
    read("index.html"),
    read("en/index.html"),
    read("ledger/index.html"),
    read("sitemap.xml"),
  ])

  assert.match(chinese, /href="\/ledger\/"[^>]*>“苏牙择时”公开承诺账本/)
  assert.match(english, /href="\/ledger\/"[^>]*>Public timing ledger/)
  assert.match(redirect, /url=\/suya-market-regime-ledger\//i)
  assert.match(redirect, /无需 GitHub|不需要 GitHub/)
  assert.match(sitemap, /https:\/\/weilisong\.com\/ledger\//)
})
