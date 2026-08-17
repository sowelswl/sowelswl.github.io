(() => {
  const root = document.querySelector('[data-component="performance-teaser"]')
  if (!root) return

  const statsEndpoint = "https://www.suyainvestments.com/api/performance/stats?time_range=all"
  const dataEndpoint = "https://www.suyainvestments.com/api/data"
  const fields = {
    totalReturn: root.querySelector('[data-performance="total-return"]'),
    totalExcess: root.querySelector('[data-performance="total-excess"]'),
    maxDrawdown: root.querySelector('[data-performance="max-drawdown"]'),
    asOf: root.querySelector('[data-performance="as-of"]'),
    status: root.querySelector("[data-performance-status]"),
  }

  const formatDrawdown = (value) => {
    const unsigned = value.replace(/^[+−-]/, "")
    return `−${unsigned}`
  }

  const locale = document.documentElement.lang.startsWith("zh") ? "zh-CN" : "en-GB"
  const formatDate = (date, options) => new Intl.DateTimeFormat(locale, options).format(new Date(`${date}T00:00:00`))

  fetch(statsEndpoint, { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error("Performance summary unavailable")
      return response.json()
    })
    .then((data) => {
      const totalReturn = data.returns.formatted.total
      const totalExcess = data.excess_returns.formatted.total
      const maxDrawdown = data.risk_metrics.formatted.max_drawdown
      const endDate = data.period.end_date

      if (![totalReturn, totalExcess, maxDrawdown, endDate].every((value) => typeof value === "string")) {
        throw new Error("Performance summary incomplete")
      }

      fields.totalReturn.textContent = totalReturn
      fields.totalExcess.textContent = totalExcess
      fields.maxDrawdown.textContent = formatDrawdown(maxDrawdown)
      fields.asOf.textContent = formatDate(endDate, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      fields.asOf.setAttribute("datetime", endDate)
      if (fields.status) {
        fields.status.textContent = ""
        fields.status.hidden = true
      }
      root.dataset.status = "live"
    })
    .catch(() => {
      if (fields.status) {
        fields.status.textContent = locale === "zh-CN"
          ? "实时摘要暂时无法加载，请打开完整报告查看。"
          : "The live summary is temporarily unavailable. Please open the complete report."
        fields.status.hidden = false
      }
      root.dataset.status = "fallback"
    })

  const chart = root.querySelector("[data-performance-chart]")
  if (!chart) return

  const portfolioPath = root.querySelector('[data-chart-series="portfolio"]')
  const benchmarkPath = root.querySelector('[data-chart-series="benchmark"]')
  const chartStart = root.querySelector('[data-chart-date="start"]')
  const chartEnd = root.querySelector('[data-chart-date="end"]')

  const sampleObservations = (rows, limit = 72) => {
    if (rows.length <= limit) return rows

    const sampled = []
    for (let index = 0; index < limit; index += 1) {
      sampled.push(rows[Math.round(index * (rows.length - 1) / (limit - 1))])
    }
    return sampled
  }

  const createPath = (rows, key, domain) => {
    const firstDate = new Date(`${rows[0].date}T00:00:00`).getTime()
    const lastDate = new Date(`${rows[rows.length - 1].date}T00:00:00`).getTime()
    const dateSpan = lastDate - firstDate || 1
    const valueSpan = domain.max - domain.min || 1

    return rows.map((row, index) => {
      const date = new Date(`${row.date}T00:00:00`).getTime()
      const x = ((date - firstDate) / dateSpan) * 1000
      const y = 240 - ((row[key] - domain.min) / valueSpan) * 220
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(" ")
  }

  fetch(dataEndpoint, { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error("Performance history unavailable")
      return response.json()
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Performance history incomplete")

      const observations = data
        .filter((row) => (
          typeof row.date === "string" &&
          Number.isFinite(row.net_value) &&
          Number.isFinite(row.index_net_value) &&
          row.net_value > 0 &&
          row.index_net_value > 0
        ))
        .sort((left, right) => left.date.localeCompare(right.date))

      if (observations.length < 2) throw new Error("Performance history incomplete")

      const first = observations[0]
      const normalized = observations.map((row) => ({
        date: row.date,
        portfolio: row.net_value / first.net_value,
        benchmark: row.index_net_value / first.index_net_value,
      }))
      const sampled = sampleObservations(normalized)
      const values = sampled.flatMap((row) => [row.portfolio, row.benchmark])
      const rawMin = Math.min(...values)
      const rawMax = Math.max(...values)
      const padding = Math.max((rawMax - rawMin) * 0.08, 0.02)
      const domain = { min: rawMin - padding, max: rawMax + padding }

      portfolioPath.setAttribute("d", createPath(sampled, "portfolio", domain))
      benchmarkPath.setAttribute("d", createPath(sampled, "benchmark", domain))

      const firstDate = sampled[0].date
      const lastDate = sampled[sampled.length - 1].date
      const dateOptions = { month: "short", year: "numeric" }
      chartStart.textContent = formatDate(firstDate, dateOptions)
      chartEnd.textContent = formatDate(lastDate, dateOptions)
      chartStart.setAttribute("datetime", firstDate)
      chartEnd.setAttribute("datetime", lastDate)
      chart.dataset.status = "live"
    })
    .catch(() => {
      if (fields.status) {
        fields.status.textContent = locale === "zh-CN"
          ? "部分实时数据暂时无法加载，请打开完整报告查看。"
          : "Some live data is temporarily unavailable. Please open the complete report."
        fields.status.hidden = false
      }
      chart.dataset.status = "fallback"
    })
})()
