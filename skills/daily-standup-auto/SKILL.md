---
name: daily-standup-auto
description: Use as a recurring watcher (cron 0 8 * * 1-5) to auto-generate the user's morning brief — yesterday's shipped work, today's priorities pulled from open episodes/threads, calendar-aware. Delivered via the user's preferred channel (Slack DM, email, mobile push). Where most "AI productivity" tools fail; this is where the discipline becomes a daily habit.
---

# Daily Standup Auto

The standup nobody else runs for you. By 8am, you know what shipped, what's stuck, and what matters today.

## When to use

- Daily, automated, 8am local time (weekdays default)
- On-demand: "give me my standup"
- Before a manager check-in

## What it reads

| Source | What it pulls |
|---|---|
| `ledger.jsonl` | Tasks completed in last 24h |
| `episodes/` | Sessions closed in last 24h |
| `beliefs.jsonl` | Beliefs added or revised |
| Watcher logs | Triggers that fired |
| Calendar (if connector active) | Today's meetings, blocks |
| Open `hitl-checkpoint` items | Decisions awaiting your call |
| `long-tasks/` | Long-running tasks status |

## Output contract

```
═══ DAILY STANDUP — Mon May 18, 2026 ═══

YESTERDAY (shipped):
✓ Landing page deployed (ep-abc)
✓ Customer call: ACME demo → followup sent (ep-def)
✓ Pricing decision locked in (b-042)

YESTERDAY (started but unfinished):
→ OAuth refactor — T2.2 in progress, T2.3 pending

YESTERDAY (stuck):
✗ Vector DB research — verifier flagged 2 sources stale, needs rerun

TODAY'S CALENDAR:
- 10:00 GST  Customer demo (BiggDate prospect)
- 14:00 GST  Product review (45 min)
- 16:00 GST  1:1 with Fatima

DECISIONS WAITING ON YOU:
- C3 from yesterday: email-first or in-app onboarding? (defaults to email-first at noon)

OPEN LONG TASKS:
- lt-x82a01: "Audit 200 PRs in alpha-corp/api" — running 3h 14m, ETA 1h

THIS WEEK'S TOP 3 PRIORITIES (from memory + beliefs):
1. Ship OAuth migration (b-042 says Q2 deadline)
2. UAE GTM 90-day plan execution (week 2 of 13)
3. Hire growth lead (open since Apr 22)

RECOMMENDED FIRST 90 MIN:
- 8:00-8:15  Skim this standup, send to team
- 8:15-9:15  Knock out the OAuth T2.3 (paired with verifier auto-run)
- 9:15-9:30  Prep for 10:00 demo (last session's notes: ep-def)
```

## Anti-patterns

- ❌ A standup that's just a list of links (synthesize)
- ❌ Including everything (be ruthless about what's actionable today)
- ❌ Inventing "priorities" that aren't grounded in the user's actual beliefs/memory
- ❌ Generic motivational fluff
- ❌ More than 1 page (it's a standup, not a memoir)

## Distribution

The standup is delivered to whichever channel the user has set:
- Email (via external-actions)
- Slack DM (via Slack surface)
- Mobile push (via mobile surface, v1.6)
- Desktop notification (if local)
- Just sits in `~/.themeetpatel/standups/<date>.md`

## Watcher config

```bash
node scripts/watchers.js add \
  --name daily-standup \
  --type cron \
  --schedule "0 8 * * 1-5" \
  --goal "Generate daily standup (skill: daily-standup-auto)" \
  --to "email:meet@finanshels.com,slack:#standups"
```

## Verification

The verifier (class: comms + ops) will:
1. Confirm every "shipped" item is traceable to a real episode.
2. Confirm "decisions waiting" reflect real open checkpoints (not invented).
3. Confirm calendar items are real (if calendar connector active).
4. Confirm the recommended-first-90-min is actionable (specific, not vague).

## Routing

- **Sonnet** for the synthesis
- **Haiku** for the formatting + delivery
