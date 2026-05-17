---
name: time-to-regret
description: For any irreversible decision, computes "if this is wrong, when will you know, and what will it cost to unwind?" Three sentences that reframe most strategic decisions. Paired with tree-of-thought and reversibility-scorer; lives at the intersection of risk + recovery.
---

# Time to Regret

The reason most bad decisions feel sudden is that nobody asked when they'd discover the badness. This question makes the answer concrete.

## When to use

- Before any tree-of-thought decision the user is about to lock in
- Before signing contracts, hires, layoffs, major spend, vendor commits
- Before pricing changes, brand changes, naming decisions
- Whenever the reversibility-scorer flags a decision as ≥ 7

## When NOT to use

- Trivially reversible decisions
- Decisions where the regret window doesn't matter (one-day campaigns)

## The three questions

```
DECISION: <one sentence>

1. WHAT'S THE FIRST SIGNAL THAT THIS WAS WRONG?
   (Be specific. What metric, behavior, or event tells you?)

2. HOW LONG UNTIL THAT SIGNAL APPEARS?
   (Days / weeks / months — be honest, not optimistic)

3. WHAT'S THE COST TO UNWIND?
   (Money + relationships + time + opportunity cost)

→ Time to regret: <T>
→ Cost of regret: <$ / effort / reputation>
```

## Output contract

```
═══ TIME TO REGRET ═══
Decision: <restatement>
Reversibility score (from reversibility-scorer): <0-10>

FIRST SIGNAL OF WRONGNESS:
<one sentence — specific, measurable>

LATENCY TO SIGNAL:
<days / weeks / months>  Confidence: <high/medium/low>

COST TO UNWIND:
Money: $<n>
Relationships: <which>
Time: <person-weeks>
Reputation: <if applicable>
Opportunity cost: <what you couldn't do during unwind>

PRE-COMMIT QUESTIONS (for the user):
1. Are you comfortable with regret latency of <T>?
2. Is the upside ≥ N× the unwind cost? (Most decisions need ≥ 3×)
3. What's the cheapest experiment that gives the signal in <half of T>?

RECOMMENDATION:
- COMMIT: regret latency acceptable, cost survivable, upside justified
- DELAY: run the cheaper experiment first
- SHRINK: take a smaller version that has faster regret latency
- ABORT: cost-of-being-wrong exceeds plausible upside
```

## Worked examples

**Decision**: "Hire the CMO candidate at $300K"
- First signal: pipeline doesn't shift in 90 days
- Latency: ~120 days (60 ramp + 60 first results)
- Cost: $300K base + 4 months relationship + severance + recruiting redo + 6mo of momentum
- Verdict: high-cost, slow-signal — shrink first via interim CMO contractor for 90 days

**Decision**: "Migrate from Stripe to Tabby for SMB"
- First signal: support tickets spike about checkout flow
- Latency: 14 days (first complete cohort cycle)
- Cost: 2 engineer-weeks to migrate back + customer trust hit on checkout reliability
- Verdict: fast-signal, recoverable — COMMIT with a feature flag and a 14-day rollback gate

**Decision**: "Sunset our legacy dashboard product"
- First signal: enterprise customer renewal pushback
- Latency: 180 days (renewal cycle)
- Cost: ~$300K ARR at risk + 1 quarter of CS time + brand hit
- Verdict: slow-signal, high-cost — DELAY pending a customer interview round first

## Anti-patterns

- ❌ Vague signals ("we'll know eventually")
- ❌ Latency estimates without a denominator (cycle length, sample size)
- ❌ Ignoring relationship + reputation cost
- ❌ Pretending upside is ≥3× when it isn't
- ❌ Using this skill to rationalize delay on every decision (some need fast COMMIT)

## Integration

Runs as Phase 3.5 (right after routing, right before delegation) when:
- Reversibility scorer flags ≥7
- The task is the synthesis of a tree-of-thought decision
- User has flagged the goal as "high stakes"

## Verification

The verifier (class: strategy) will:
1. Confirm first signal is measurable.
2. Confirm latency is bounded (not "unknown").
3. Confirm cost has multiple categories (money + others).
4. Confirm recommendation has a concrete next action.

## Routing

- **Opus** — this is judgment-heavy strategic reasoning
