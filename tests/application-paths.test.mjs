import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("research exchange stays open while the former membership path is closed", async () => {
  const [research, membership, styles] = await Promise.all([
    read("connect/research/index.html"),
    read("connect/private-research/index.html"),
    read("assets/css/landing.css"),
  ])

  assert.match(research, /<title>投研交流 — 宋伟力<\/title>/)
  assert.match(research, /<h1>投研交流<\/h1>/)
  assert.doesNotMatch(research, /申请投研交流/)
  assert.match(research, /研究方向|交流主题/)
  assert.match(research, /能分享|可贡献/)
  assert.match(research, /先关注[\s\S]*苏牙说[\s\S]*再添加[\s\S]*个人微信/)
  assert.match(research, /src="\/images\/wechat-suyashuo-qr\.png"[^>]+alt="微信公众号苏牙说二维码"/)
  assert.match(research, /src="\/images\/wechat\.jpg"[^>]+alt="宋伟力个人微信二维码"/)
  assert.match(research, /微信号：sowelswl/)
  assert.equal((research.match(/class="application-qr-link"/g) ?? []).length, 2)
  assert.match(research, /手机端可长按二维码识别/)
  assert.match(research, /点击二维码查看原图/)
  assert.doesNotMatch(research, /mailto:/)

  assert.match(membership, /<meta name="robots" content="noindex, nofollow">/)
  assert.match(membership, /私人投研会员已关闭/)
  assert.match(membership, /不再开放候补或接受申请/)
  assert.doesNotMatch(membership, /发送[“「]私人投研会员[”」]|application-qr|wechat\.jpg|wechat-suyashuo-qr\.png/)

  assert.match(styles, /\.application-channel-grid/)
  assert.match(styles, /\.application-qr/)
  assert.match(styles, /\.application-qr-link/)
  assert.match(styles, /\.application-qr-tip/)
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

test("only the active research exchange path remains in the sitemap", async () => {
  const sitemap = await read("sitemap.xml")

  assert.match(sitemap, /https:\/\/weilisong\.com\/connect\/research\//)
  assert.doesNotMatch(sitemap, /https:\/\/weilisong\.com\/connect\/private-research\//)
})
