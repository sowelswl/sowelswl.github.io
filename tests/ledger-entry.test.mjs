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
  assert.match(ledger, /每天一条[\s\S]*时序信号/)
  assert.match(ledger, /核心研究资产/)
  assert.match(ledger, /中证500[\s\S]*沪深300[\s\S]*中证1000[\s\S]*中证2000[\s\S]*上证指数/)
  assert.match(ledger, /无需 GitHub|不需要 GitHub/)
  assert.match(ledger, /看平[\s\S]*轻微多头/)
  assert.match(ledger, /强空[\s\S]*轻微空头/)
  assert.match(ledger, /右偏[\s\S]*多头/)
  assert.doesNotMatch(ledger, /看平<\/strong><small>中性观察/)
  assert.match(ledger, /id="evaluation"/)
  assert.match(ledger, /全部历史用来评价/)
  assert.match(ledger, /最近 20 个交易日/)
  assert.match(ledger, /id="latest-record"/)
  assert.match(script, /raw\.githubusercontent\.com\/sowelswl\/suya-market-regime-ledger\/main\/docs\/data\/index\.json/)
  assert.match(script, /crypto\.subtle\.digest/)
  assert.match(script, /historical_evaluation/)
  assert.match(script, /direction_hit_rate/)
  assert.match(script, /signal_db\.public\.jq_time_series_signal_daily/)
  assert.match(script, /ret_trend_lev_ma_5level_calendar/)
  assert.match(script, /micro_timing_final_tail_hold_dates/)
  assert.match(script, /commitment\.source\s*!==\s*reveal\.source/)
  assert.match(script, /invalidatedDates/)
  assert.match(script, /已作废/)
  assert.match(script, /corrections/)
  assert.match(alias, /url=\/ledger\//i)
  assert.match(sitemap, /https:\/\/weilisong\.com\/ledger\//)
})
