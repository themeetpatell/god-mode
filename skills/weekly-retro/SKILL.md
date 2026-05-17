---
name: weekly-retro
description: Use as a weekly watcher (cron 0 17 * * 5 — Friday 5pm) to generate the user's retrospective. Honest, not flattering. Surfaces patterns, drift, beliefs that updated, anti-patterns observed, where the week's actual work matched vs diverged from stated priorities. The mirror most operators don't have.
---

# Weekly Retro

The retrospective that's not just "what shipped" but "what shifted." Friday 5pm so the weekend can do its job.

## When to use

- Friday 5pm (recommended schedule)
- Before a strategic offsite or board prep
- After any major launch / inflection point

## What it reads (in addition to daily standup sources)

- 5-7 days of episodes
- Beliefs added + revised this week
- Anti-patterns surfaced
- Verifier verdicts (pass / conditional / fail rate trend)
- Cost vs budget tracking
- Watcher fires + their outcomes
- Memory diff vs week start

## Output contract

```
═══ WEEKLY RETRO — Week of May 12-18, 2026 ═══

WHAT YOU ACTUALLY DID (vs what you said you'd do)
─────────────────────────────────────────────────
Stated top 3 priorities (from last week's retro / memory):
  1. Ship OAuth migration
  2. UAE GTM execution (week 1)
  3. Hire growth lead

Time distribution (by episode tags):
  - oauth: 28%  ✓ priority 1 — well-aligned
  - uae-gtm: 18% ✓ priority 2 — somewhat aligned
  - hiring: 4%   ⚠ priority 3 — under-invested
  - landing-page: 22% (not a stated priority)
  - customer-calls: 16% (always)
  - misc: 12%

DRIFT FLAG:
  You spent 22% of your week on the landing page; only 4% on hiring.
  Hiring has been priority 3 for 4 weeks running with no movement.
  Either deprioritize it explicitly OR carve protected time next week.

WHAT SHIPPED (verified):
  - OAuth refactor complete (ep-abc, ep-def, ep-ghi)
  - Landing page live + Vercel-deployed (ep-jkl)
  - Pricing decision locked (b-042)
  - UAE GTM week 1: WhatsApp sequence drafted

WHAT FAILED VERIFICATION:
  - Vector DB research (ep-xyz) — fail, sources stale
  - Webhook handler test (ep-mno) — conditional, rate-limit not added

BELIEFS THAT CHANGED:
  - b-001 → b-042: pricing model (per-seat → usage-based for enterprise)
  - b-017: ICP narrowed (was "UAE B2B SMB", now "UAE B2B SMB 10-50 employees in finance/services")

PATTERNS DETECTED (procedural memory):
  - You've now done "customer call → followup → CRM update" 6 times this week
  - Worth packaging as a skill (`customer-call-followup`)? Y/N
  - 3 conditional-pass episodes had the same defect class (missing rate limit)
  - Worth adding to anti-pattern-lib? Y/N

COST + VERIFIER HEALTH
──────────────────────
  Spend: $34.20 (week)  | Budget: $125/mo, on track
  Verifier pass rate: 89% (32/36) — stable
  Conditional rate: 8% — within range
  Fail rate: 3% — within range

ROUTER ACCURACY
───────────────
  Sessions used cross-vendor: 0 (still Anthropic-only)
  Adversarial trap survival: continuous 100% this week

WHAT TO DO DIFFERENTLY NEXT WEEK
────────────────────────────────
  1. Protect 4 hours for hiring (or kill the priority publicly)
  2. Rerun the vector DB research with fresh sources
  3. Add rate limits to webhook flows (procedural pattern detected)
  4. Decide on the customer-call-followup skill induction

OPEN THREADS GOING INTO NEXT WEEK
─────────────────────────────────
  - C3: onboarding flow decision (still open, defaults to email-first Monday)
  - hire: growth lead candidate at offer stage
  - bug: webhook signature mismatch under load (T1.2 from ep-xyz)

REVISIT NEXT WEEK
─────────────────
  - b-042 (pricing) at 30-day mark to validate
  - Run anti-pattern-lib check on next week's content
  - Refresh router calibration if any new vendors added
```

## Anti-patterns

- ❌ Retro that's all positive (most weeks have honest drift; show it)
- ❌ "What shipped" without "what stalled"
- ❌ Pattern detection without specific next action
- ❌ More than 1 actionable change recommended per priority area (overload)
- ❌ Generic motivational closer ("great week, keep it up")

## Watcher config

```bash
node scripts/watchers.js add \
  --name weekly-retro \
  --type cron \
  --schedule "0 17 * * 5" \
  --goal "Generate weekly retro (skill: weekly-retro)" \
  --to "email:meet@finanshels.com"
```

## Verification

The verifier (class: ops + strategy) will:
1. Confirm "what shipped" items match real episodes.
2. Confirm drift flag is supported by actual time distribution math.
3. Confirm pattern detections cite the underlying episodes.
4. Confirm "what to do differently" items are specific (named action + owner).

## Routing

- **Opus** for the drift analysis + recommended changes (judgment-heavy)
- **Sonnet** for the body
- **Haiku** for the time-distribution computation + table formatting
