import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

function section(html, id) {
  const start = html.indexOf(`<section id="${id}"`)
  const end = html.indexOf("</section>", start)

  return html.slice(start, end)
}

test("both homepages distinguish the personal WeChat ID from the official account", async () => {
  const [chinese, english] = await Promise.all([read("index.html"), read("en/index.html")])

  assert.match(chinese, /微信：sowelswl/)
  assert.match(chinese, /公众号：苏牙说 · dasuyatalk/)
  assert.match(english, /WeChat: sowelswl/)
  assert.match(english, /Official Account: 苏牙说 · dasuyatalk/)
})

test("the contact sections explain how to find Suya Talk in WeChat", async () => {
  const [chinese, english] = await Promise.all([read("index.html"), read("en/index.html")])

  assert.match(chinese, /id="suya-talk"[\s\S]*data-channel="wechat-official-account"[\s\S]*微信公众号[\s\S]*苏牙说[\s\S]*微信内搜索[\s\S]*dasuyatalk/)
  assert.match(english, /id="contact"[\s\S]*data-channel="wechat-official-account"[\s\S]*WeChat Official Account[\s\S]*苏牙说[\s\S]*search dasuyatalk in WeChat/i)
  assert.doesNotMatch(chinese, /href="[^"]*dasuyatalk/)
  assert.doesNotMatch(english, /href="[^"]*dasuyatalk/)
})

test("all direct contact methods live in the contact section instead of the profile", async () => {
  const [chinese, english] = await Promise.all([read("index.html"), read("en/index.html")])
  const chineseProfile = section(chinese, "profile")
  const chineseContact = section(chinese, "contact")
  const englishProfile = section(english, "profile")
  const englishContact = section(english, "contact")

  assert.doesNotMatch(chineseProfile, /weilisong@hnu\.edu\.cn|微信：|QQ：|GitHub|LinkedIn|知乎|雪球/)
  assert.doesNotMatch(englishProfile, /weilisong@hnu\.edu\.cn|WeChat:|QQ:|GitHub|LinkedIn|Zhihu|Xueqiu/)

  for (const item of ["weilisong@hnu.edu.cn", "微信：sowelswl", "QQ：405113793", "GitHub", "LinkedIn", "知乎", "雪球"]) {
    assert.match(chineseContact, new RegExp(item))
  }
  for (const item of ["weilisong@hnu.edu.cn", "WeChat: sowelswl", "QQ: 405113793", "GitHub", "LinkedIn", "Zhihu", "Xueqiu"]) {
    assert.match(englishContact, new RegExp(item))
  }
})

test("the official-account entry has dedicated responsive styling", async () => {
  const css = await read("assets/css/landing.css")

  assert.match(css, /\.wechat-channel\s*\{[\s\S]*overflow-wrap:\s*anywhere;/)
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.wechat-channel/)
})

test("the official-account cards show the supplied scannable QR image", async () => {
  const [chinese, english, image] = await Promise.all([
    read("index.html"),
    read("en/index.html"),
    readFile(new URL("images/wechat-suyashuo-qr.png", root)),
  ])

  assert.equal(image.toString("ascii", 1, 4), "PNG")
  assert.deepEqual(
    { width: image.readUInt32BE(16), height: image.readUInt32BE(20) },
    { width: 430, height: 430 },
  )
  assert.match(chinese, /<img[^>]+src="\/images\/wechat-suyashuo-qr\.png"[^>]+alt="微信公众号苏牙说二维码"/)
  assert.match(english, /<img[^>]+src="\/images\/wechat-suyashuo-qr\.png"[^>]+alt="QR code for the Suya Talk WeChat Official Account"/)
})

test("the Chinese homepage and archive promote the representative WeChat article", async () => {
  const [chinese, archive] = await Promise.all([read("index.html"), read("notes/index.html")])
  const articleUrl = "https://mp.weixin.qq.com/s/c45VdLSXmSYlyz7NHEo8Fw"
  const articleTitle = "大跌全部提前预警，24篇零失准——跟读这个小众盘前系列，你可能已经少亏了10%以上"

  for (const page of [chinese, archive]) {
    assert.match(page, new RegExp(articleUrl.replaceAll("/", "\\/")))
    assert.match(page, new RegExp(articleTitle))
    assert.match(page, /微信公众号 · 苏牙说/)
  }
  assert.match(archive, /<span>03 篇<\/span>/)
})
