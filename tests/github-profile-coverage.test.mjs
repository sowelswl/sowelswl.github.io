import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), "utf8")
}

test("the homepage leads with capabilities and keeps identity secondary", async () => {
  const html = await read("index.html")

  assert.match(html, /量化研究与实盘记录/)
  assert.match(html, /全栈量化系统/)
  assert.match(html, /选股与择时实盘/)
  assert.match(html, /AI 2\.0与RSI迭代/)
  assert.match(html, /宋伟力/)
  assert.doesNotMatch(html, /苏牙[^<。]*品牌|苏牙的主理人|宋伟力肖像/)
  assert.match(html, /https:\/\/github\.com\/sowelswl\/suya-market-regime-ledger/)
})

test("AI supports the method without becoming a competing homepage identity", async () => {
  const html = await read("index.html")

  assert.match(html, /AI[^。<]*研究|LLM[^。<]*研究/)
  assert.doesNotMatch(html, /id="ai-workflow"|智能的溢出|GPT-3 Completion/)
})
