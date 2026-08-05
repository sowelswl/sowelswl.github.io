# Weili Song · 宋伟力

This repository powers [weilisong.com](https://weilisong.com/), the personal website of Weili Song.

宋伟力是湖南大学管理科学与工程博士研究生，拥有 3 年私募从业经验，目前独立管理自营资金。当前主要投入 A 股主观交易、LLM 辅助决策与量化研究。

## Website purpose

The site helps a visitor understand three things quickly:

1. Who Weili is and how his path developed from quantitative systems to discretionary trading.
2. How AI and LLM workflows support research, review, and decision making without replacing human responsibility.
3. Where to inspect research evidence, including AlphaForge and the separate live portfolio report.

The Chinese edition at `/` is the canonical homepage. The English edition lives at `/en/`. Historical results are presented as research evidence, not as investment advice or a promise of future performance.

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
