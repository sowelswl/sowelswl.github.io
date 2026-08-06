import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("research exchange and private research have separate, scoped application paths", async () => {
  const [research, membership] = await Promise.all([
    read("connect/research/index.html"),
    read("connect/private-research/index.html"),
  ])

  assert.match(research, /申请投研交流/)
  assert.match(research, /研究方向|交流主题/)
  assert.match(research, /能分享|可贡献/)
  assert.match(research, /如何了解到苏牙/)
  assert.match(research, /mailto:weilisong@hnu\.edu\.cn/)

  assert.match(membership, /苏牙私人投研会员/)
  assert.match(membership, /候补|一个月/)
  assert.match(membership, /交易经验/)
  assert.match(membership, /风险认知/)
  assert.match(membership, /不代客理财|不提供个性化买卖指令/)
  assert.match(membership, /mailto:weilisong@hnu\.edu\.cn/)
})

test("application pages collect no asset, income, or holding details", async () => {
  const pages = await Promise.all([
    read("connect/research/index.html"),
    read("connect/private-research/index.html"),
  ])

  for (const html of pages) {
    assert.doesNotMatch(html, /资产规模|收入|具体持仓|身份证/)
  }
})

test("public application paths are included in the sitemap", async () => {
  const sitemap = await read("sitemap.xml")

  assert.match(sitemap, /https:\/\/weilisong\.com\/connect\/research\//)
  assert.match(sitemap, /https:\/\/weilisong\.com\/connect\/private-research\//)
})
