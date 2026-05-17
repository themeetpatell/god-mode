---
name: budget-caps
description: Use to set per-session, per-project, and per-month spending limits with graceful degradation. Integrates with cost-preflight to refuse roadmaps that exceed budget, with the ledger to track running spend, and with the CEO to suggest scope cuts when nearing a cap. Critical for non-developer users who need predictability.
---

# Budget Caps

Black-box token spend is the #1 reason non-developer users distrust AI tools. Visible caps with graceful degradation is the cure.

## When to use

- Default: always (every session checks against caps)
- Explicit: user wants a cheap-mode session ("under $1, route everything to Haiku")
- Project-level: a client engagement has a fixed AI-spend budget
- Monthly: org-level cap (any user in the org can't exceed)

## Cap types

| Type | Example | Source of truth |
|---|---|---|
| `per_session_usd` | $5 max per session | env `THEMEETPATEL_BUDGET_USD` or interactive |
| `per_project_usd` | $200/mo for project X | `~/.themeetpatel/budgets/<project>.json` |
| `per_month_usd` | $500/mo total | `~/.themeetpatel/budgets/monthly.json` |
| `per_user_per_day_usd` | $20/day per user (org mode) | team-config.json |
| `hard_stop` | Refuse if exceeded | true (default) for org budgets, false for personal |

## Graceful degradation

When approaching a cap (≥ 80%):
1. CEO surfaces remaining headroom in next intake: "you have $1.20 left this month; this roadmap estimates $0.40"
2. Suggest cheaper mode: "want me to route the Opus tasks to Sonnet to save ~$0.25?"
3. Suggest scope cut: "the bottom 2 tasks in Phase 3 are nice-to-have; cutting them saves $0.30"
4. Offer to defer: "stash this roadmap and resume next month?"

When at or over cap with `hard_stop: true`:
- Refuse new sessions
- Allow finishing in-progress tasks (don't strand work mid-roadmap)
- Log the refusal so user/admin can adjust

## CLI

```bash
node scripts/budgets.js set --type per_month_usd --value 500
node scripts/budgets.js set --project finanshels --type per_project_usd --value 200
node scripts/budgets.js status
node scripts/budgets.js report --month 2026-05
```

## Output contract (status)

```
═══ BUDGET STATUS ═══
Period: 2026-05  (May 2026)

PERSONAL CAPS:
  Monthly:    $500.00     used: $217.34  (43%)   remaining: $282.66
  Per-session: $5.00 (default)

PROJECT CAPS:
  finanshels:    $200/mo    used: $112.00  (56%)   remaining: $88.00
  biggdate:      $50/mo     used: $48.20   (96%)   ⚠ near cap

ORG CAPS (if in org):
  Daily:      $20/day      used: $3.40

ESTIMATED REMAINING SESSIONS THIS MONTH (at avg $1.20/session): ~235

UPCOMING:
  - finanshels project will hit cap in ~3 weeks at current pace
  - biggdate is at 96% — sessions will switch to cheap-mode until reset on June 1
```

## Anti-patterns

- ❌ Stranding mid-roadmap when budget hits zero (always finish in-progress)
- ❌ Silently downgrading model without notifying (always tell user)
- ❌ Setting caps so low that legitimate work is blocked
- ❌ Caps with no enforcement (info-only caps are theater)
- ❌ Ignoring cap warnings until hard-stop hits

## Integration with cost-preflight

```
1. User: /god-mode <goal>
2. CEO builds roadmap
3. cost-preflight estimates roadmap cost
4. budget-caps checks against active caps
5. If would-exceed: degrade or pause + ask user
6. If within: proceed
7. After session: ledger updates spend
```

## Verification

The verifier (class: ops) will:
1. Confirm pre-flight estimate ran before session start.
2. Confirm spend was logged after session completed.
3. Confirm degradation events (downgraded models, cut scope) were surfaced to user.
4. Confirm hard-stop refusal logs include the offered alternatives.

## Routing

- **Haiku** for the cap-check math (mechanical)
- **Sonnet** for the degradation suggestions (judgment about what to cut)
