# Weili Song · 宋伟力

This repository powers [weilisong.com](https://weilisong.com/), the personal website of Weili Song.

宋伟力是湖南大学管理科学与工程博士研究生，拥有 3 年私募从业经验，目前独立管理自营资金，是一名量化与主观结合的 A 股自营交易者；具体方法把主观交易研究、量化研究与风险判断放在同一条链路中，AI 与 LLM 只承担研究辅助角色。

## Website purpose

The site helps a visitor understand three things quickly:

1. Who Weili is, how the Suya brand is organized, and how subjective research and quantitative systems work together.
2. Where to follow Suya Talk, the primary public-content and reader-relationship channel.
3. Where to inspect evidence, including the proprietary portfolio record, AlphaForge, and the [public timing ledger](https://github.com/sowelswl/suya-market-regime-ledger).
4. How qualified traders and researchers can apply for lightweight research exchange.

The Chinese edition at `/` is the canonical, full homepage. The English edition at `/en/` is intentionally concise. Research-exchange and private-research information live at `/connect/research/` and `/connect/private-research/`. Historical results are evidence, not investment advice, fundraising, managed-money solicitation, or a promise of future performance.

## Operating model

- Monthly: one portfolio or risk observation based on the live report.
- Quarterly: one durable research note connecting a question, evidence, limitations, and implementation.
- Annually: one transparent letter covering process, results, mistakes, and priorities.

The full editorial system and publishing checks are documented in [CONTENT_OPERATIONS.md](./CONTENT_OPERATIONS.md). Investor-site benchmarks and the design rationale are recorded in [BENCHMARK_RESEARCH.md](./BENCHMARK_RESEARCH.md).

## Local preview and verification

```bash
python3 -m http.server 4173
node --test tests/*.test.mjs
```

Then open `http://127.0.0.1:4173/`.

After both the personal site and Investment API have been deployed, verify the live cross-site component without printing portfolio records:

```bash
node scripts/verify-production-integration.mjs
```

The command checks the exact CORS origin, required public response fields, observation count, and absence of browser-visible identity fields.

## Public contact

- Email: [weilisong@hnu.edu.cn](mailto:weilisong@hnu.edu.cn)
- GitHub: [sowelswl](https://github.com/sowelswl)
- Live portfolio report: [Suya Investments](https://www.suyainvestments.com/)

Hosted with [GitHub Pages](https://pages.github.com/) and the custom domain `weilisong.com`.
