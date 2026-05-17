---
name: dread-index
description: For any roadmap, score "dependency dread" — how much of the plan depends on people, systems, or external events outside the user's direct control. High-dread plans get explicit risk callouts so the user isn't blindsided when external blockers stall execution.
---

# Dependency Dread Index

The number of times a plan dies because "we were waiting on someone" or "the API was down" or "legal hadn't reviewed" is non-zero. This skill makes that risk visible upfront.

## When to use

- After Phase 2 (Roadmap) on any plan with > 3 phases
- Pre-quarterly-planning (which OKRs have the most external dependency risk)
- Before committing to a deadline you didn't fully control
- After a plan that already stalled — diagnose how much of the stall was external

## Dread categories

| Category | Examples | Score weight |
|---|---|---|
| **Wait on a person** | Approval, review, feedback, sign-off | 3 |
| **Wait on a system** | External API, third-party tool, vendor SLA | 2 |
| **Wait on an event** | Market timing, regulation, customer behavior | 4 |
| **Wait on yourself** | Need uninterrupted time, deep work, decision energy | 1 |
| **Wait on data** | Need analytics, need customer count, need ledger update | 2 |
| **Wait on money** | Budget approval, vendor invoice paid, funding closed | 3 |

## Scoring

For each task in the roadmap:
1. Identify dependencies (already in roadmap as `needs:` field)
2. For each dependency, classify it
3. Compute task dread = sum of dependency weights
4. Compute plan dread = max(task dread) + median(task dread)

Plans with plan dread > 8 are HIGH-DREAD and need explicit risk callouts.

## Output contract

```
═══ DEPENDENCY DREAD INDEX ═══
Roadmap: <slug>
Total tasks: <n>

PER-TASK DREAD:
  T1.1 (dread 1): self-only — low risk
  T2.1 (dread 4): waiting on Fatima's review + waiting on Stripe API — medium risk
  T2.2 (dread 7): waiting on customer count from Q1 + legal approval + budget sign-off — HIGH RISK
  T3.1 (dread 3): waiting on T2.2 + waiting on calendar opening — medium

PLAN DREAD: 8 (max 7, median 4)
VERDICT: HIGH-DREAD — explicit risk callouts recommended

EXTERNAL DEPENDENCIES SUMMARY:
- People you're waiting on: Fatima (review), Legal (approval)
- Systems: Stripe API
- Events: Q1 customer count (data freshness)
- Money: Budget sign-off

RISK CALLOUTS FOR THE USER:
⚠ Highest-risk task (T2.2):
   - Has 3 simultaneous external dependencies
   - Historical: tasks with 3+ external dependencies stalled an average of 14 days
   - Mitigation: pre-fetch each dependency THIS WEEK before starting T2.2 work

MITIGATIONS (specific):
1. Today: message Fatima with the review request, give her 48h
2. Today: confirm Stripe API status + grab credentials
3. This week: pull the Q1 customer count
4. This week: get budget sign-off signal before committing engineering time

ALTERNATIVES THAT REDUCE DREAD:
- Cut T2.2's legal approval requirement by scoping the work to non-customer-facing first
- Move T2.2 ahead of T1.1 so its dependencies can be unblocked in parallel
- Shrink T2.2 into 3 sub-tasks with one external dependency each
```

## Anti-patterns

- ❌ Treating self-dependencies as dread (you control those)
- ❌ Listing dependencies without mitigations
- ❌ Flagging dread but not surfacing it in the exec summary
- ❌ Letting users discover dread mid-execution instead of pre-flight

## Integration

- CEO's Phase 2.5 (Self-critique) reads this output and folds the highest-risk tasks into the critique
- The exec summary includes "EXTERNAL BLOCKERS PRE-IDENTIFIED" if dread was high

## Verification

The verifier (class: strategy + ops) will:
1. Confirm every external dependency has a mitigation.
2. Confirm high-dread tasks have specific pre-emptive actions.
3. Confirm the user sees the dread score before committing the plan.

## Routing

- **Haiku** — mostly classification + arithmetic
- **Sonnet** — the mitigation generation
