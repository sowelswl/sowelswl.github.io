import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const source = await readFile(new URL("../assets/js/performance-teaser.js", import.meta.url), "utf8")
const pages = ["../index.html", "../en/index.html"]

test("both homepages include an accessible live strategy-versus-benchmark chart", async () => {
  for (const page of pages) {
    const html = await readFile(new URL(page, import.meta.url), "utf8")

    assert.match(html, /data-performance-chart/)
    assert.match(html, /data-chart-series="portfolio"/)
    assert.match(html, /data-chart-series="benchmark"/)
    assert.match(html, /role="img"/)
    assert.match(html, /aria-labelledby="performance-chart-title performance-chart-desc"/)
  }
})

test("the teaser normalizes observed NAV data into distinct chart paths", async () => {
  const elements = new Map()
  for (const field of ["annualized-return", "annualized-excess", "max-drawdown", "as-of"]) {
    elements.set(`[data-performance="${field}"]`, {
      textContent: "—",
      setAttribute() {},
    })
  }

  const portfolioPath = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value } }
  const benchmarkPath = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value } }
  const chartStart = { textContent: "—", setAttribute() {} }
  const chartEnd = { textContent: "—", setAttribute() {} }
  const chart = { dataset: {} }
  elements.set('[data-chart-series="portfolio"]', portfolioPath)
  elements.set('[data-chart-series="benchmark"]', benchmarkPath)
  elements.set('[data-chart-date="start"]', chartStart)
  elements.set('[data-chart-date="end"]', chartEnd)
  elements.set("[data-performance-chart]", chart)

  const root = {
    dataset: {},
    querySelector(selector) {
      return elements.get(selector) ?? null
    },
  }
  const document = {
    documentElement: { lang: "en" },
    querySelector(selector) {
      return selector === '[data-component="performance-teaser"]' ? root : null
    },
  }
  const requested = []
  const fetch = async (url) => {
    requested.push(url)
    if (url.includes("/api/data")) {
      return {
        ok: true,
        async json() {
          return [
            { date: "2026-01-03", net_value: 1.21, index_net_value: 1.1 },
            { date: "2026-01-02", net_value: 1.1, index_net_value: 1.05 },
            { date: "2026-01-01", net_value: 1, index_net_value: 1 },
          ]
        },
      }
    }
    return {
      ok: true,
      async json() {
        return {
          period: { end_date: "2026-01-03" },
          returns: { formatted: { annualized: "21.00%" } },
          excess_returns: { formatted: { annualized: "8.00%" } },
          risk_metrics: { formatted: { max_drawdown: "9.00%" } },
        }
      },
    }
  }

  vm.runInNewContext(source, { Date, Error, Intl, Math, document, fetch })
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))

  assert.ok(requested.some((url) => url === "https://www.suyainvestments.com/api/data"))
  assert.match(portfolioPath.attributes.d, /^M /)
  assert.match(benchmarkPath.attributes.d, /^M /)
  assert.notEqual(portfolioPath.attributes.d, benchmarkPath.attributes.d)
  assert.match(chartStart.textContent, /2026/)
  assert.match(chartEnd.textContent, /2026/)
  assert.equal(chart.dataset.status, "live")
})
