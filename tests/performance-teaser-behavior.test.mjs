import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

const source = await readFile(new URL("../assets/js/performance-teaser.js", import.meta.url), "utf8")

function createPage(lang) {
  const elements = new Map(
    ["annualized-return", "annualized-excess", "max-drawdown", "as-of"].map((field) => [
      `[data-performance="${field}"]`,
      {
        attributes: {},
        textContent: "—",
        setAttribute(name, value) {
          this.attributes[name] = value
        },
      },
    ]),
  )
  const root = {
    dataset: {},
    querySelector(selector) {
      return elements.get(selector)
    },
  }
  const document = {
    documentElement: { lang },
    querySelector(selector) {
      return selector === '[data-component="performance-teaser"]' ? root : null
    },
  }

  return { document, elements, root }
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0))
}

test("live summary fills all promotional metrics and localizes the Chinese date", async () => {
  const page = createPage("zh-CN")
  const fetch = async () => ({
    ok: true,
    async json() {
      return {
        period: { end_date: "2026-08-05" },
        returns: { formatted: { annualized: "12.34%" } },
        excess_returns: { formatted: { annualized: "5.67%" } },
        risk_metrics: { formatted: { max_drawdown: "8.90%" } },
      }
    },
  })

  vm.runInNewContext(source, { Date, Error, Intl, document: page.document, fetch })
  await settle()

  assert.equal(page.elements.get('[data-performance="annualized-return"]').textContent, "12.34%")
  assert.equal(page.elements.get('[data-performance="annualized-excess"]').textContent, "5.67%")
  assert.equal(page.elements.get('[data-performance="max-drawdown"]').textContent, "−8.90%")
  assert.match(page.elements.get('[data-performance="as-of"]').textContent, /2026/)
  assert.equal(page.elements.get('[data-performance="as-of"]').attributes.datetime, "2026-08-05")
  assert.equal(page.root.dataset.status, "live")
})

test("failed live summary leaves safe placeholders and records fallback state", async () => {
  const page = createPage("en")
  const fetch = async () => ({ ok: false })

  vm.runInNewContext(source, { Date, Error, Intl, document: page.document, fetch })
  await settle()

  assert.equal(page.elements.get('[data-performance="annualized-return"]').textContent, "—")
  assert.equal(page.root.dataset.status, "fallback")
})
