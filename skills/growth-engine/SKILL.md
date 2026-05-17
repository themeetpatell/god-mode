---
name: growth-engine
description: Use for designing demand engines, GTM systems, channel architecture, lifecycle automation, attribution, founder-led distribution, and operating plans where the deliverable is a compounding system, not a one-off campaign. Ships with channel benchmarks, funnel math, and a 30/60/90-day experiment plan.
---

# Growth Engine

Most "growth strategies" are wishlists. A growth engine is a system: define the user, the offer, the channels, the funnel, the math, and the experiments — then ship the smallest version that proves the loop.

## When to use

- New product needing a GTM motion from zero
- Stalled product where the funnel is leaking and nobody can name where
- Channel decision (which 2-3 channels to actually invest in vs spray-and-pray)
- Lifecycle redesign (onboarding, activation, retention, expansion, winback)
- Founder-led distribution strategy (community, content, partnerships)
- 30/60/90-day operating plan for a growth function

## When NOT to use

- One-off campaign brief (use `sales-copywriter` or `content-strategist`)
- SEO-specific work (use `seo-aeo-geo`)
- Outreach sequences only (use `partnerships-outreach` or `sales-copywriter`)
- Brand work — this skill doesn't do brand strategy

## The protocol

### Phase 1 — Pin the ICP, offer, and trigger (always)

Before any channel talk:

```
ICP (one ideal customer):
  Who: <role + company size + industry + geography>
  Pain (their words, not yours): <quoted if possible>
  Status quo: <what they do today instead of buying you>
  Buying trigger: <the event that makes them shop — a hire, a fail, a new policy>
  Buying authority: <who signs>
  Buying cycle: <weeks>
  Willingness to pay: <range>

OFFER (one sentence the ICP would forward):
  Promise: <outcome>
  Time to value: <days>
  Proof: <what makes the promise believable>
  Price + packaging: <model + ranges>
  Risk reversal: <guarantee / trial / month-to-month>

URGENCY:
  Why now: <market / regulatory / seasonal / loss-aversion driver>
```

If ICP, offer, and trigger don't all fit on one page, the rest of the plan will rot. Stop and tighten.

### Phase 2 — Channel selection (intent × speed-to-revenue)

Plot every candidate channel on this matrix:

| Intent level | Speed to revenue | Channel examples |
|---|---|---|
| High intent + fast | Days–weeks | Inbound (SEO/AEO bottom-funnel), Google brand+category, paid intent (high-cap keywords), warm referrals, partner referrals |
| High intent + slow | Months | Outbound sales (named accounts), partnerships, integrations marketplace, industry events |
| Low intent + fast | Days | Paid social (broad), display retargeting, sponsorships |
| Low intent + slow | Months | Founder content, podcasts, community-led, PR, owned media |

Pick **2 channels max** for first 90 days. One that's fast (proves the offer works). One that compounds (builds the moat).

### Phase 3 — Funnel math (the gating exercise)

Walk the math from goal back to spend. No vibes.

```
GOAL (90-day): <e.g., $X MRR added>
Working backwards:

Customers needed: <goal / ACV>
Trials needed: <customers / trial→paid rate>
Demos needed: <trials / demo→trial rate>
SQLs needed: <demos / SQL→demo rate>
MQLs needed: <SQLs / MQL→SQL rate>
Top-of-funnel touches: <MQLs / touch→MQL rate>

By channel:
| Channel | TOF target | Cost per touch | Total spend | Touch→MQL | MQL→SQL | SQL→customer |
| Paid LinkedIn | <n> | $X | $Y | <%> | <%> | <%> |
| Founder content | <n> | $0 (time) | <hours> | <%> | <%> | <%> |
| Outbound | <n> | $X | $Y | <%> | <%> | <%> |

PAYBACK:
  CAC: $<n>
  ACV (yr 1): $<n>
  Gross margin: <%>
  Payback months: <months>
  LTV/CAC target: <ratio>
```

If LTV/CAC < 3 or payback > 18 months, the channel mix is wrong. Re-pick.

### Phase 4 — Lifecycle (the multiplier)

A funnel without a lifecycle is a sieve. Design every stage:

| Stage | Goal | Trigger | Action | Owner | Metric |
|---|---|---|---|---|---|
| Awareness | First touch | Cold | Asset delivery | Marketing | Reach, CTR |
| Intent | Self-identify | Signup / demo book | Qualification | Sales | MQL→SQL |
| Conversion | First purchase | SQL | Close motion | Sales | Win rate, ACV |
| Onboarding | First value | Signed | Activation guide | Onboarding | Time-to-value |
| Adoption | Habit formed | <30d post-activation | Trigger-based nudges | Lifecycle | 30/60/90-day retention |
| Expansion | Bigger | Usage threshold | Upsell motion | CSM | NRR |
| Advocacy | Refers | Score event | Referral ask | Lifecycle | Referral rate |
| Winback | Returned | Churn signal | Save play | CSM | Saves |

Every transition has a trigger, an action, an owner, and a metric. If any is blank, the stage leaks.

### Phase 5 — 30/60/90 experiment plan

```
DAYS 1-30 — Prove the offer
  Goal: <metric to hit, e.g., 20 booked demos from 2 channels>
  Bets:
    B1. <channel 1 launch — exact campaign>
    B2. <channel 2 launch>
  Decisions at day 30:
    - If <channel> hits, double down to $<budget>
    - If not, kill or rework offer

DAYS 31-60 — Tune the funnel
  Goal: <conversion rate to hit>
  Bets:
    B3. <conversion experiment>
    B4. <lifecycle experiment>
  Decisions at day 60:
    - <decision criteria>

DAYS 61-90 — Compound
  Goal: <compounding metric, e.g., 30% of TOF from non-paid>
  Bets:
    B5. <content engine launch>
    B6. <partner motion launch>
  Decisions at day 90:
    - <criteria for hiring growth lead / scaling spend>
```

Every bet has a falsifiable success metric. No "explore the market" experiments.

### Phase 6 — Instrumentation

Without instrumentation, none of the above matters.

Required at minimum:
- UTM convention enforced on every paid asset
- Lead source captured on every signup (UTM → first_touch in CRM)
- Funnel events fired (signup, activated, first_value, upgraded, churned)
- One source of truth for revenue + one for pipeline (named — Stripe, HubSpot, etc.)
- Weekly dashboard owned by one named person

### Phase 7 — Deliverable

```
═══ GROWTH ENGINE PLAN ═══
Product: <name>  Owner: <name>  Date: <date>  Horizon: 90 days

GROWTH THESIS (2 sentences):
<what compounding loop you're building and why it works for this ICP>

ICP / OFFER / URGENCY: <as above>

CHANNEL CHOICE (2 channels):
- <channel 1>: rationale, target spend, target output
- <channel 2>: rationale, target spend, target output

FUNNEL MATH: <as above>

LIFECYCLE: <as above table>

EXPERIMENTS (30/60/90): <as above>

AUTOMATIONS:
- <name>: triggered by <event>, sends <action>, owned by <person>
- <name>: ...

METRICS / DASHBOARD:
| Metric | Definition | Cadence | Owner | Target |
| MQLs | <def> | weekly | Marketing | <n> |
| SQL→customer | <def> | weekly | Sales | <%> |
| Activation rate | <def> | weekly | Onboarding | <%> |
| 30-day retention | <def> | monthly | Lifecycle | <%> |
| NRR | <def> | quarterly | CSM | <%> |
| CAC | <def> | monthly | Finance | $<n> |
| Payback months | <def> | quarterly | Finance | <months> |

OPS NOTES:
- Hire trigger: <when to hire growth lead / SDR>
- Spend ceiling: $<n>/mo until <metric>

WHAT WE WON'T DO (and why):
- <channel> — wrong intent for our ICP
- <tactic> — non-compounding
```

## Anti-patterns

- ❌ "Spray and pray" across 6 channels in month 1
- ❌ Choosing channels by what other companies do, not what your ICP does
- ❌ "Build a community" with no specific community owner or weekly motion
- ❌ Vague metrics ("brand awareness," "engagement")
- ❌ No payback calculation
- ❌ Lifecycle = "we send a welcome email"
- ❌ Treating outbound as a script problem when it's actually an ICP problem
- ❌ Doubling spend on a channel before it has hit statistical sample size
- ❌ Founder content with no editorial calendar
- ❌ Attribution debates that delay action

## Channel benchmark anchors (use as priors, validate with your own data)

| Channel | Typical CTR | Typical CVR | Typical CAC range |
|---|---|---|---|
| Google brand | 3-8% | 5-15% | low |
| Google category | 1-3% | 1-5% | medium |
| LinkedIn ads (B2B) | 0.4-0.8% | 5-15% landing→MQL | high |
| Meta ads (B2C) | 1-2% | 1-3% | low-medium |
| Cold email | 30-50% open, 5-15% reply | 10-20% reply→meeting | medium |
| LinkedIn outbound | 30-40% accept, 10-25% reply | 10-20% reply→meeting | medium |
| Founder content (LinkedIn) | n/a — impression-driven | 0.1-1% impression→signup | low (time) |
| Partner referrals | n/a | 30-60% if warm | very low |
| SEO (bottom-funnel) | 2-10% click | 2-10% click→signup | very low after fixed build |

These are anchors, not laws. Your numbers can be 2× better or 2× worse depending on offer fit. Track them.

## Worked example (truncated)

ICP: B2B finance ops leads at UAE-based SMBs (10-50 employees) running QuickBooks and drowning in receivables.

Offer: AED-native receivables automation that books 3 weeks of FOps work in 1 day, $499/mo, no setup, 30-day money back.

Trigger: month-end close stress + new UAE e-invoicing mandate (regulatory).

90-day channel pick:
- **Fast**: LinkedIn outbound to named accounts (300 SMB FOps leads in UAE), 4-touch sequence, target 12 demos / 4 customers
- **Compounding**: founder LinkedIn (3 posts/week on UAE FOps reality), aim for 5K weekly impressions to ICP by day 60, 8-12 inbound demos/mo by day 90

Funnel math: 4 customers/mo × $499 × 12 = $24K ARR per cohort. CAC target: < $1.5K. Payback: < 4 months.

Then 30/60/90 plan, lifecycle stages, instrumentation, dashboard. Done.

## Routing

- **Haiku**: filling the channel benchmark table, generating dashboard skeleton
- **Sonnet**: default — the full plan
- **Opus**: when the plan informs a hiring decision (first growth lead) or a fundraise

## Verification protocol

The `verifier` (class: strategy) will:
1. ICP, offer, trigger all named in one place.
2. Funnel math includes CAC, payback, LTV/CAC.
3. ≤ 2 primary channels picked.
4. 30/60/90 plan has falsifiable success metrics per phase.
5. Lifecycle table fully populated (no blank cells).
6. Instrumentation requirements listed.

Conditional pass if benchmarks not tied to user's own data (often unavoidable at zero). Fail if no funnel math or no falsifiable experiments.
