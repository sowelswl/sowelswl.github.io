import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the homepage uses the settled Suya brand architecture", async () => {
  const html = await read("index.html")

  assert.match(html, /苏牙[^<。]*品牌|苏牙的主理人/)
  assert.match(html, /苏牙说/)
  assert.match(html, /苏牙投资/)
  assert.match(html, /宋伟力/)
  assert.match(html, /个人自营研究与历史记录/)
})

test("AI supports the method without becoming a competing homepage identity", async () => {
  const html = await read("index.html")

  assert.match(html, /AI[^。<]*研究|LLM[^。<]*研究/)
  assert.doesNotMatch(html, /id="ai-workflow"|智能的溢出|GPT-3 Completion/)
})
