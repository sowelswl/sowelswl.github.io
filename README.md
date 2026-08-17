# Quantitative Research & Live Record · 量化研究与实盘记录

This repository powers [weilisong.com](https://weilisong.com/), a quantitative research and live-performance archive maintained by Weili Song.

网站以能力与可验证结果为主线：覆盖单人从零到一建设的全栈量化系统，已进入个人账户实盘的选股与择时模型，以及由 AI 2.0、Vibe Coding 和 RSI 式递归自我改进推动、由人负责验证和风险治理的策略研究迭代。

## Website purpose

The site helps a visitor understand three things quickly:

1. How a solo, zero-to-one full-stack quantitative system was built from research through live execution.
2. How AI 2.0, vibe coding, and RSI-style recursive iteration increase research throughput under human validation and risk governance.
3. Where to inspect evidence, including the personal-account portfolio record, AlphaForge, and the [public timing ledger](https://github.com/sowelswl/suya-market-regime-ledger).
4. How qualified traders and researchers can begin a lightweight research exchange.

The Chinese edition at `/` is the canonical, full homepage. The English edition at `/en/` is intentionally concise. Research exchange remains available at `/connect/research/`; the former private-research membership page at `/connect/private-research/` is closed and excluded from search indexing. Historical results are personal-account evidence, not investment advice, fundraising, managed-money solicitation, or a promise of future performance.

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
