import assert from "node:assert/strict"
import test from "node:test"

import { verifyProductionIntegration } from "../scripts/verify-production-integration.mjs"

const allowedOrigin = "https://weilisong.com"

function response(body, { cors = allowedOrigin, status = 200 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "access-control-allow-origin": cors,
      "content-type": "application/json",
    },
  })
}

test("production verification accepts privacy-safe live responses", async () => {
  const requests = []
  const fetchMock = async (url, options) => {
    requests.push({ url, options })
    if (url.includes("/stats")) {
      return response({
        returns: { formatted: { total: "10.0%" } },
        excess_returns: { formatted: { total: "2.0%" } },
        risk_metrics: { formatted: { max_drawdown: "-8.0%" } },
        period: { end_date: "2026-08-05" },
      })
    }

    return response([
      { date: "2026-08-04", net_value: 1.1, index_net_value: 1.02, excess_return: 0.01 },
      { date: "2026-08-05", net_value: 1.11, index_net_value: 1.03, excess_return: 0.011 },
    ])
  }

  const result = await verifyProductionIntegration(fetchMock)

  assert.equal(result.stats.asOf, "2026-08-05")
  assert.equal(result.data.observations, 2)
  assert.equal(requests.length, 2)
  assert.ok(requests.every(({ options }) => options.headers.Origin === allowedOrigin))
})
test("production verification rejects a missing or incorrect CORS boundary", async () => {
  const fetchMock = async () => response({}, { cors: "*" })

  await assert.rejects(
    verifyProductionIntegration(fetchMock),
    /expected Access-Control-Allow-Origin/,
  )
})

test("production verification rejects identity fields in browser-visible data", async () => {
  const fetchMock = async (url) => {
    if (url.includes("/stats")) {
      return response({
        returns: { formatted: { total: "10.0%" } },
        excess_returns: { formatted: { total: "2.0%" } },
        risk_metrics: { formatted: { max_drawdown: "-8.0%" } },
        period: { end_date: "2026-08-05" },
      })
    }

    return response([{ date: "2026-08-05", net_value: 1.1, index_net_value: 1.02, investor_name: "hidden" }])
  }

  await assert.rejects(
    verifyProductionIntegration(fetchMock),
    /identity field/i,
  )
})
