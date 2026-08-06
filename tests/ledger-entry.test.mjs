import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

test("the personal site hosts the public ledger without a project Pages deployment", async () => {
  const [chinese, english, ledger, script, alias, sitemap] = await Promise.all([
    read("index.html"),
    read("en/index.html"),
    read("ledger/index.html"),
    read("ledger/assets/ledger.js"),
    read("suya-market-regime-ledger/index.html"),
    read("sitemap.xml"),
  ])

  assert.match(chinese, /href="\/ledger\/"[^>]*>“苏牙择时”公开承诺账本/)
  assert.match(english, /href="\/ledger\/"[^>]*>Public timing ledger/)
  assert.match(ledger, /苏牙择时/)
  assert.match(ledger, /无需 GitHub|不需要 GitHub/)
  assert.match(ledger, /id="latest-record"/)
  assert.match(script, /raw\.githubusercontent\.com\/sowelswl\/suya-market-regime-ledger\/main\/docs\/data\/index\.json/)
  assert.match(script, /crypto\.subtle\.digest/)
  assert.match(alias, /url=\/ledger\//i)
  assert.match(sitemap, /https:\/\/weilisong\.com\/ledger\//)
})
