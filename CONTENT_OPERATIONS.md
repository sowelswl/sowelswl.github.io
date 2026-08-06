# Content Operations

## Positioning

Primary audience: professional investors, research collaborators, quantitative or AI teams, and specialist recruiters.

Core identity: **宋伟力是一名主观交易者与量化研究者，用系统化方法训练判断，用 AI 和 LLM 扩展研究能力。**

The homepage should answer four questions in order:

1. **个人信息：**他是谁、在哪里、做过什么、现在专注什么。
2. **路径：**为什么从纯量化系统转向主观交易与 AI 辅助决策。
3. **证据：**论文、竞赛、工程能力与真实运行过的量化实盘档案。
4. **下一步：**阅读完整实盘、查看研究，或开始一次专业交流。

The site is a personal profile and research hub, not an institution pretending to manage outside capital and not a stock-picking service. Avoid short-term calls, unsourced superiority claims, copied static return figures, and language that implies guaranteed future performance.

## Editorial system

The durable content layer lives under `/notes/`. The homepage shows only the two most useful current entries; the archive keeps the complete record. Each article has its own directory, canonical URL, publication date, author, related-note navigation, and a clear boundary between personal experience and investment advice.

Current foundation articles:

- `/notes/quant-to-discretionary/`: the 2023–2025 quantitative phase, the 2025.11 pivot, and the current 80/20 allocation.
- `/notes/ai-workflow/`: the progression from GPT-3 Completion to Claude Code, Codex, and Agent Systems.

When a new article is published:

1. Create one descriptive, permanent directory under `/notes/`; never encode the date in the URL.
2. Add the article to `/notes/index.html` with author, date, category, and a one-sentence thesis.
3. Add an entry to `/feed.xml`, and move the feed-level `updated` value to the new publication time.
4. Replace the less relevant homepage preview if the new article better explains current work; keep only two featured entries.
5. Add the canonical route to `sitemap.xml` and use an article-specific campaign name on any live-report link.
6. Verify the article at desktop and narrow widths before publishing.

### 月度复盘 · Monthly Portfolio Note

Publish once after each calendar month closes.

- One chart answering one portfolio, benchmark, or risk question.
- What changed and what did not change in the process.
- The most important drawdown, exposure, or decision-quality observation.
- One limitation or uncertainty that remains.
- A methodology reminder and one link to the live report.
- No position-level signals unless disclosure has been explicitly approved.

### 季度研究 · Quarterly Research to Practice

Publish one durable case study each quarter.

- Research or trading question.
- Why the question matters economically.
- Data, evidence, and validation design.
- What survived out-of-sample or live scrutiny.
- How discretionary judgment, quantitative tooling, and LLM support divided the work.
- What changed in implementation and what would invalidate the conclusion.

### 年度信 · Annual Investment and Research Letter

- Year in review with clearly dated performance evidence.
- Important drawdown and recovery episodes.
- Decisions that worked, decisions that failed, and lessons retained.
- Research completed, rejected, or moved into practice.
- Process changes and priorities for the coming year.
- Full disclaimer and methodology links.

## Article template

1. One-sentence thesis.
2. A chart or table that answers one question.
3. Interpretation in plain language.
4. What decision this changes, if any.
5. Limitations and what would invalidate the conclusion.
6. Link to the live report, paper, or reproducible artifact.
7. Publication date, last-updated date, and author.

## Distribution

The website is the canonical source. Adapt each article instead of reposting it unchanged:

- LinkedIn: professional conclusion and collaboration relevance.
- 知乎: method explanation and longer educational context.
- 雪球: portfolio and risk observation, with no short-term recommendation.
- GitHub: code, notebooks, or reproducible research artifacts when appropriate.

Each channel should point back to one canonical article or the live portfolio report. Use campaign parameters on those links so referrals can be distinguished without exposing visitor identities.

## Conversion path

Visitor → personal profile → research or experience → live performance report → methodology → email conversation.

Use one primary call to action per section. Prefer “查看实盘报告”, “阅读研究”, or “与我联系” over generic buttons such as “了解更多”. The homepage live-report links use the `personal_site` campaign so investment-site analytics can identify this referral path.

## Metrics

Review monthly:

- Click-through rate to the live performance report.
- Return visits to research notes.
- Completed reads of quarterly case studies.
- Qualified collaboration emails.
- Referrals from LinkedIn, 知乎, 雪球, and GitHub.

Do not optimize for page views alone. A smaller number of relevant readers who inspect the evidence is more valuable than undifferentiated traffic.

## Publishing checklist

- Personal role, current focus, dates, and public contact details match the latest GitHub Profile.
- Performance values come from the live report and are never copied into static promotional prose.
- Every performance statement has an as-of date, benchmark, and methodology link.
- No identity fields, credentials, database details, or internal debug information appear in page source.
- Search title, description, canonical URL, language alternatives, sitemap, and social preview are current.
- Live-report campaign links still resolve and remain attributable to `personal_site`.
- `node scripts/verify-production-integration.mjs` passes against the two production Investment API endpoints.
- Links, mobile layout, keyboard focus, and reduced-motion behavior are checked.
- The production URL is verified after GitHub Pages finishes deploying.
