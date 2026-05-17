---
name: decision-review
description: Every locked-in decision (in the belief register) gets a quarterly "is this still right?" prompt. Decisions decay; this catches it. Surfaces decisions whose underlying conditions have changed, where new evidence contradicts, or that simply haven't been revisited in too long.
---

# Decision Review

Founders make decisions and then forget they made them. By the time the decision is obviously wrong, the cost of unwinding has compounded. This skill stops that.

## When to use

- Quarterly (recommended schedule alongside `quarterly-okr-check`)
- On-demand: "audit my open decisions"
- When a major external event happens (regulatory change, market shift)
- Before a strategic offsite

## What it reads

- `beliefs.jsonl` — all active beliefs
- `episodes/` — sessions where each belief was acted on
- `memory/` — facts the belief depends on
- (Optional) recent news / market data via deep-research skill

## The review protocol

For each active belief:

```
B042 — "Pricing is per-seat for SMB, usage-based for enterprise"
LOCKED: 2026-04-15  (3 months ago)
CONFIDENCE: 0.85
LAST ACTED ON: 2026-05-10  (1 week ago — actively in use)

UNDERLYING CONDITIONS:
- SMB customers are price-sensitive on per-user
- Enterprise customers prefer predictability of usage-based

CHECK FOR REVISION TRIGGERS:
✓ Underlying conditions still hold (no contradicting feedback)
✓ No new market data (Stripe / Anthropic / competitors haven't shifted)
✓ Beliefs that depend on this still aligned: b-051, b-067

VERDICT: HOLDS — no action needed
NEXT REVIEW: 2026-08-15 (next quarter)
```

When something HAS changed:

```
B042 — "Pricing is per-seat for SMB"
LOCKED: 2026-04-15
LAST ACTED ON: 2026-05-10

REVISION TRIGGERS DETECTED:
⚠ ep-xyz (3 customer conversations): SMB owners explicitly resist per-seat ("too much admin")
⚠ ep-mno: Adjacent SaaS in our category just shifted to flat-rate SMB and reported lift
⚠ Competitor analysis (deep-research ep-pqr): 4 of 6 reference customers now offer flat-rate SMB

VERDICT: REVISIT
SUGGESTED ACTION:
  - Run tree-of-thought on the pricing decision with the new evidence
  - Test a flat-rate SMB option with 5 prospects this month
  - Revisit B042 after the test
WOULD AFFECT: b-051 (revenue model), b-067 (sales motion)
```

## Surfacing dependent decisions

The review walks the dependency graph: when B042 is flagged for revisit, the system surfaces every belief and roadmap that depended on B042. So you see the full blast radius of the potential revision.

## Output contract

```
═══ DECISION REVIEW — Q2 2026 ═══
Beliefs reviewed: <n>
Beliefs holding: <n>
Beliefs flagged for revisit: <n>
Beliefs marked stale (no longer relevant): <n>

REVISIT QUEUE (priority order):
1. B042 — pricing model (high-impact, evidence of shift)
2. B017 — ICP narrowing (working, but check at 6-month mark)
3. ...

NEXT ACTIONS:
- Schedule tree-of-thought session for B042 by end of week
- Note B017 for review at 6mo (2026-09)

STALE DECISIONS (consider archiving):
- B003 — "we'll launch on Product Hunt in Q1" (Q1 passed, decision moot)

BELIEFS NEVER ACTED ON (proposed prune):
- B009 — "we should consider Asia expansion" (added Feb, never used in any session)

DECISION HYGIENE METRICS:
- Median time between belief creation and last action: <days>
- % beliefs acted on in last 30 days: <%>
- # of beliefs in revisit-queue over time (trend)
```

## Anti-patterns

- ❌ Reviewing every belief every quarter (some don't need review)
- ❌ Auto-revising beliefs (the user decides; this just surfaces)
- ❌ Surfacing beliefs without dependent-blast-radius context
- ❌ Pretending old decisions are settled when evidence has shifted
- ❌ Stale decisions left in active register forever

## Integration

Runs alongside `quarterly-okr-check`. Output feeds into next quarter's planning so the OKRs reflect the actual decision-state, not the decision-state from 3 months ago.

## Verification

The verifier (class: strategy) will:
1. Confirm every belief flagged for revisit has cited evidence.
2. Confirm dependency graph traversal was performed.
3. Confirm next actions are concrete (with dates / owners).
4. Confirm stale-decision archive doesn't lose audit trail.

## Routing

- **Opus** for the revisit-triggers analysis (judgment-heavy)
- **Sonnet** for the report body
- **Haiku** for graph traversal + dependency walk
