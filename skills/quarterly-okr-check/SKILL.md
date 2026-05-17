---
name: quarterly-okr-check
description: Quarterly retrospective specifically focused on OKR alignment — what % of the quarter's actual work matched stated priorities, what objectives drifted, what to commit to next quarter. Reads OKRs from ~/.themeetpatel/okrs.md or memory.facts.okrs and cross-references against 90 days of episodes.
---

# Quarterly OKR Check

The "I'm not sure what we shipped this quarter" feeling is universal. This kills it. By the end of every quarter you have an honest scorecard.

## When to use

- End of Q1 / Q2 / Q3 / Q4 (default: last Friday of the quarter)
- Before a board meeting where you'll discuss quarter results
- Pre-quarterly-planning to inform the next quarter's OKRs
- Whenever priorities feel "off" and you want the data

## OKR source

The user maintains OKRs in:
- `~/.themeetpatel/okrs.md` (simple markdown) — preferred
- OR `memory.facts.okrs` (structured JSON inside memory)

Format:

```markdown
# OKRs — Q2 2026

## Objective 1: Validate UAE B2B SMB GTM
- KR1: 30 customer demos with UAE FOps leads
- KR2: 6 paying customers signed
- KR3: $30K MRR from UAE segment

## Objective 2: Ship the AI-native v2 product
- KR1: Verifier shipped to production
- KR2: 100 active users on v2
- KR3: NPS ≥ 40
```

## What the skill does

For each KR:
1. Extract keywords (UAE, demo, customer, MRR, verifier, etc.)
2. Cross-reference against episode tags + goals in the last 90 days
3. Compute time invested + outcomes shipped
4. Score progress against the KR target

For each Objective:
1. Aggregate KR progress
2. Identify drift — what work happened that wasn't aligned to any OKR
3. Identify gaps — KRs with little/no work invested
4. Surface beliefs that shifted relevant to the OKR

## Output contract

```
═══ QUARTERLY OKR CHECK — Q2 2026 ═══
Period: Apr 1 – Jun 30, 2026
Episodes analyzed: 87
Total cost this quarter: $612.40

OBJECTIVE 1: Validate UAE B2B SMB GTM
─────────────────────────────────────
Status: ON TRACK (62% of KR progress at 67% of quarter)

KR1 (30 UAE FOps demos): 22/30 — 73% — ON TRACK
  Sessions: 18 episodes tagged uae-gtm, 12 customer-call episodes
  Pace: ~7/month, need ~8/month to hit
KR2 (6 paying customers): 4/6 — 67% — ON TRACK
  Time-to-close averaging 18 days
KR3 ($30K MRR from UAE): $21K/30K — 70% — ON TRACK
  ACV averaging $5.25K
  Notable belief revision: b-017 narrowed ICP — likely contributed to lift

ALLOCATED TIME: 24% of total quarter spend (target: ~33% based on importance)
UNDER-ALLOCATED by ~9 percentage points

OBJECTIVE 2: Ship AI-native v2
─────────────────────────────
Status: AHEAD (89% at 67% of quarter)

KR1 (Verifier in prod): SHIPPED in v1.2 (Apr 22)
KR2 (100 active users on v2): 142/100 — DONE
KR3 (NPS ≥ 40): currently 43 — DONE

ALLOCATED TIME: 38% of total quarter spend (target: ~33%)
OVER-ALLOCATED — completion ahead of schedule means you can re-allocate

DRIFT — work not aligned to any OKR
───────────────────────────────────
- Landing page refresh: 8% of quarter (was this priority? not in stated OKRs)
- Personal content engine: 7% (long-term brand bet — flag for next quarter's OKRs)
- Misc consulting / advice calls: 6%
- Tool maintenance: 9% (Cost ledger upgrades, etc — reasonable overhead)

TOTAL DRIFT: 30% — within healthy range (15-35%); above 35% means re-pick OKRs

BELIEFS THAT CHANGED THIS QUARTER (relevant to OKRs)
────────────────────────────────────────────────────
- b-017 (ICP narrowed) — helped O1 conversion rate
- b-042 (pricing) — changed mid-quarter; KR3 math needs adjusting
- b-051 (verifier alone is the moat) — informs O2 v3 planning

RECOMMENDATIONS FOR Q3
──────────────────────
1. Re-up O1: investing slightly more (33% target) to lock $30K → $50K MRR
2. Sunset or refocus O2: shipped early. New O2 candidates:
   - O2': Cross-vendor router launch
   - O2'': Hosted SaaS MVP
   - O2''': Marketplace + 3rd-party pack contributions
3. Make landing-page work explicit (current OKR omitted it)
4. Add a "drift budget" of 20-25% so non-OKR work has a sanctioned home

NEXT QUARTER PLANNING SESSION (suggested):
- Date: Friday Jun 27, 2026 (last working day of quarter)
- Inputs to read: this brief + active beliefs + last 3 customer call episodes
- Outputs: Q3 OKRs.md (in same format) + reset of episode tags to match
```

## Anti-patterns

- ❌ Scoring KRs without naming the underlying episode evidence
- ❌ Hiding drift to make the quarter look better
- ❌ Recommending too many Q3 changes (3-5 max)
- ❌ OKR check that doesn't reset for next quarter (the loop matters)
- ❌ Treating "ahead of schedule" as automatically good (could mean OKR was too easy)

## Watcher config

```bash
node scripts/watchers.js add \
  --name quarterly-okr \
  --type cron \
  --schedule "0 9 30 3,6,9,12 *" \
  --goal "Generate quarterly OKR check (skill: quarterly-okr-check)" \
  --to "email:meet@finanshels.com"
```

## Verification

The verifier (class: ops + strategy) will:
1. Confirm KR progress cites real episodes/numbers.
2. Confirm drift % is computed from actual time distribution.
3. Confirm belief revisions referenced exist in the belief register.
4. Confirm Q3 recommendations are concrete (not "consider improving").

## Routing

- **Opus** — strategic synthesis
- Downstream formatting: Sonnet
