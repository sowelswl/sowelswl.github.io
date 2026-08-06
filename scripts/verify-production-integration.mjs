import { pathToFileURL } from "node:url"

const allowedOrigin = "https://weilisong.com"
const endpoints = {
  stats: "https://www.suyainvestments.com/api/performance/stats?time_range=all",
  data: "https://www.suyainvestments.com/api/data",
}
function assertCors(response, label) {
  const actual = response.headers.get("access-control-allow-origin")
  if (actual !== allowedOrigin) {
    throw new Error(`${label}: expected Access-Control-Allow-Origin ${allowedOrigin}, received ${actual ?? "none"}`)
  }
}

function containsIdentityField(value) {
  if (!value || typeof value !== "object") return false
  if (Array.isArray(value)) return value.some(containsIdentityField)

  return Object.entries(value).some(([key, child]) => (
    key.toLowerCase() === "investor_name" || containsIdentityField(child)
  ))
}

async function fetchJson(fetchImpl, label, url) {
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/json",
      Origin: allowedOrigin,
    },
    cache: "no-store",
  })

  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`)
  assertCors(response, label)

  const body = await response.json()
  if (containsIdentityField(body)) throw new Error(`${label}: browser-visible response contains an identity field`)
  return body
}

export async function verifyProductionIntegration(fetchImpl = fetch) {
  const stats = await fetchJson(fetchImpl, "performance stats", endpoints.stats)
  const requiredStats = [
    stats?.returns?.formatted?.total,
    stats?.excess_returns?.formatted?.total,
    stats?.risk_metrics?.formatted?.max_drawdown,
    stats?.period?.end_date,
  ]
  if (!requiredStats.every((value) => typeof value === "string")) {
    throw new Error("performance stats: expected public summary fields are incomplete")
  }

  const data = await fetchJson(fetchImpl, "performance data", endpoints.data)
  if (!Array.isArray(data) || data.length < 2) {
    throw new Error("performance data: expected at least two observations")
  }

  const rowsAreValid = data.every((row) => (
    typeof row.date === "string" &&
    Number.isFinite(row.net_value) &&
    Number.isFinite(row.index_net_value)
  ))
  if (!rowsAreValid) throw new Error("performance data: response shape is incomplete")

  return {
    stats: { asOf: stats.period.end_date },
    data: { observations: data.length },
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  verifyProductionIntegration()
    .then((result) => {
      console.log(`✓ performance stats: live through ${result.stats.asOf}`)
      console.log(`✓ performance data: ${result.data.observations} privacy-safe observations`)
      console.log(`✓ CORS: restricted to ${allowedOrigin}`)
    })
    .catch((error) => {
      console.error(`✗ production integration failed: ${error.message}`)
      process.exitCode = 1
    })
}
