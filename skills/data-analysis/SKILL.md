---
name: data-analysis
description: Use for CSV/spreadsheet analysis, KPI design, scorecards, dashboards, funnel metrics, cohort analysis, and turning numbers into operating decisions. Every metric defined with numerator, denominator, source, cadence, owner. No vanity metrics.
---

# Data Analysis

The job is to convert a spreadsheet into a decision. The deliverable is never "here are some numbers" — it's "here is what to do."

## When to use

- CSV/Excel/Google Sheets dropped in for analysis
- KPI/scorecard design for a team or company
- Dashboard spec from scratch
- Funnel diagnostics ("our conversion dropped, why?")
- Cohort retention analysis
- Data-quality audit before trusting a metric
- A/B test reads (where statistical significance matters)

## When NOT to use

- The user just wants a chart for a deck — that's `pptx` or BI tool work
- Database-level data engineering (use `integration-architect`)
- Strategic decisions where data is one of many inputs (use `product-strategist` or `growth-architect` and call this skill as a sub-step)

## The metric definition contract

Every metric you propose or describe MUST include these six fields. No exceptions:

```
METRIC: <name>
NUMERATOR: <exact count or sum, with grain>
DENOMINATOR: <exact count or sum, with grain>
SOURCE: <table.column or sheet, with refresh time>
CADENCE: <daily / weekly / monthly>
OWNER: <named person or role>
WHY IT MATTERS: <one sentence — what decision this drives>
```

If any field is missing, the metric is not ready to be a KPI. Park it.

## The protocol

### Phase 1 — Frame the question

```
BUSINESS QUESTION:
DECISION SUPPORTED:
WHAT WOULD CHANGE IF WE LEARNED <X>?
```

If "nothing would change," kill the analysis. You're saving everyone time.

### Phase 2 — Data audit FIRST (always)

Before computing anything, audit:

| Check | Why |
|---|---|
| Row count vs expected | Detect dropped data |
| Distinct values in key columns | Detect dupes, casing issues, "NULL"-as-string |
| Date range, gaps, future dates | Detect freshness + ingestion bugs |
| Null/missing %s per column | Don't average over missing data without flagging |
| Grain: is one row one event, one user, one day? | Wrong grain = wrong everything |
| Time zone of dates | UTC vs local destroys cohort math |
| Currency / unit of numeric columns | $ vs ¢ vs AED |

Report findings BEFORE any analysis. If data is broken, fix the source or scope down — don't paper over.

### Phase 3 — Compute, with assumptions explicit

Every computed number needs:
- The formula (in spreadsheet notation or SQL)
- The filter set applied
- The exclusions ("excluded 142 rows where amount < 0")

### Phase 4 — Surface what matters

Three buckets:

1. **What's confirmed.** Numbers + reads that the data supports.
2. **What's a hypothesis.** Patterns suggested but not proven by this dataset.
3. **What's a data problem.** Things you can't answer without better data.

### Phase 5 — Produce the deliverables

```
═══ DATA ANALYSIS BRIEF ═══

QUESTION:
DECISION SUPPORTED:

DATA CHECK:
- Rows: <n> (expected: <n>)
- Grain: <one row = ?>
- Date range: <start> → <end>
- Quality issues: <list, or "none material">

METRICS (each as above contract):
1. <name>: <value> [trend: ↑↓ vs prior period]
2. <name>: <value>
3. <name>: <value>

KEY FINDINGS:
1. <finding> — supported by metric #N
2. <finding> — supported by metric #N
3. <finding> — hypothesis, needs <data> to confirm

DECISION IMPLICATIONS:
- <if X, then do Y>
- <if X, then do Y>

DASHBOARD SPEC:
| Panel | Metric | Chart type | Cadence | Owner |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

DATA QUALITY ACTIONS:
- <fix needed> — owner: <name>

NEXT ANALYSIS:
- <follow-up question this raised>
```

## Anti-patterns

- ❌ "Conversion went up 23%" without a denominator
- ❌ Comparing this week to last week without seasonality / day-of-week adjustment
- ❌ Calling a 4-day movement a "trend"
- ❌ Stacking percentages that exceed 100
- ❌ Mixing units (sessions, users, accounts) in the same funnel without conversion logic
- ❌ Reporting averages without distribution / outliers
- ❌ "MAU" without defining the M
- ❌ Trusting a number on a dashboard whose query you haven't read

## Worked example

Input: a 12-week CSV of signup events with columns: `email, signup_ts, plan, source, country, activated_ts`.

User question: "Why is activation dropping?"

Bad version:
> "Activation dropped from 42% to 31%. You should improve onboarding."

Good version:

```
DATA CHECK:
- Rows: 4,217 signups across 12 weeks
- Grain: one row = one signup (1 email max once via dedupe on lowercase)
- Date range: 2026-02-22 → 2026-05-16, weekly bucketed Mon-Sun
- Quality issues:
  - 312 rows (7.4%) have null `activated_ts`. Treated as "not activated."
  - `source` is null for 188 rows (4.5%). Excluded from source-cut analysis.
  - Week 10 has 1,043 signups (3.4× normal). Investigation: a TechCrunch mention. Flagging as anomaly, computing with/without.

METRICS:
1. Activation rate (with anomaly week): activated_within_7_days / total_signups = 36.2% (12-wk avg)
   - Numerator: count(distinct email where activated_ts within 7 days of signup_ts)
   - Denominator: count(distinct email)
   - Source: signups.csv, refresh: weekly Sunday 23:00 GST
   - Cadence: weekly
   - Owner: Growth lead
2. Activation rate (excluding week 10 anomaly): 41.8% → still declining w/w by ~1.1pp/week
3. Activation by source: organic 51%, paid 28%, partner 47%
4. Activation by country: UAE 49%, India 38%, US 24% (small n=82)

KEY FINDINGS:
1. The headline "activation dropped from 42% to 31%" is mostly the TechCrunch spike of low-intent signups in week 10. Adjusted, decline is 1.1pp/week.
2. Paid-source activation is half of organic. The decline correlates with a paid-traffic push starting week 8.
3. US cohort activation is 24% — but n=82, so this is a hypothesis not a finding.

DECISION IMPLICATIONS:
- If the goal is total activated users, the paid channel is below break-even at current spend (back-of-envelope CAC needed — flag for growth-architect skill).
- If the goal is activation rate, pause paid for 2 weeks and re-measure baseline.

DATA QUALITY ACTIONS:
- Backfill `source` for the 188 null rows (likely missing UTM passthrough). Owner: Eng.
- Add a `first_action_ts` column so activation isn't binary 7-day. Owner: Eng.

NEXT ANALYSIS:
- Cohort retention curves for paid vs organic — does paid catch up by week 4?
```

That's the difference between number-dumping and decision support.

## Anti-patterns specific to dashboards

When designing a dashboard, demand:
- A primary metric per panel (no 4-line charts with no headline)
- A comparison (vs target, vs prior period, vs benchmark)
- A "what to do if this turns red" annotation
- A data freshness timestamp

If the dashboard doesn't say what action to take, it's a screensaver.

## Routing

- **Haiku**: data audit table cleanup, CSV-to-formatted-table conversion
- **Sonnet**: default for analysis + brief production
- **Opus**: when the analysis informs a high-stakes call (pricing change, layoff, major spend) and the user wants tradeoff reasoning, not just data

## Verification protocol

The `verifier` (class: data) will:
1. Check every metric has all 6 fields filled in.
2. Walk percentages — none exceed 100, parts sum to whole.
3. Check numerator/denominator definitions are consistent across metrics.
4. Verify data-quality issues are surfaced, not buried.
5. Sanity-check one or two computations against the raw data.

Fail if a metric is reported without source, cadence, owner, or if percentages don't add up.
