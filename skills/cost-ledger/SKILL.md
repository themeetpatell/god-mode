---
name: cost-ledger
description: Use for token/cost tracking, routing economics, savings reporting, waste detection, and turning the abstract "we save on tokens" claim into actual numbers. Backed by ~/.themeetpatel/ledger.jsonl which the log-routing hook populates per Task call, and the scripts/ledger.js CLI that reports against it.
---

# Cost Ledger

The previous version of this skill was a 27-line stub telling the LLM to "think about cost." This version is a real ledger backed by real files.

## The system

| Component | What it does | Path |
|---|---|---|
| **`scripts/log-routing.js`** | Hook fired after every Task call. Writes a structured row to ledger.jsonl. | hooked via `hooks/hooks.json` |
| **`~/.themeetpatel/ledger.jsonl`** | Append-only JSONL. One row per routed task. | `~/.themeetpatel/` |
| **`scripts/ledger.js`** | CLI that reports on the ledger: per-model breakdown, savings, waste, verifier health. | `scripts/ledger.js` |
| **`scripts/route-learn.js`** | Reads ledger.jsonl, updates router pattern weights based on outcomes. | `scripts/route-learn.js` |
| **`~/.themeetpatel/router-weights.json`** | Learned weight overrides the router reads on boot. | `~/.themeetpatel/` |
| **This skill** | The protocol for using the system. | this file |

## When to use this skill

- Weekly cost / savings report
- Diagnosing routing waste (Opus where Sonnet would have sufficed)
- Tuning the router (feeding learn script on a schedule)
- Pre-month-end cost forecast
- Founder talking about ROI of God Mode

## Ledger row schema

```ts
type LedgerRow = {
  ts: string;                          // ISO timestamp
  session_id: string;                  // groups rows from one God Mode session
  task_id: string;                     // unique per Task call
  task_text: string;                   // first 200 chars of prompt
  subagent_type: string;               // which agent the CEO routed to
  routed_model: 'haiku-4.5' | 'sonnet-4.6' | 'opus-4.7';
  actual_model: string;                // same as routed, or 'escalated' / 'downscaled'
  escalated_to?: string;
  input_tokens: number | null;         // populated when API usage telemetry is wired
  output_tokens: number | null;
  cost_usd: number | null;             // calculated by ledger.js if null
  wall_ms?: number;
  outcome: 'shipped' | 'rework' | 'failed' | 'skipped' | 'unknown';
  verifier_verdict: 'pass' | 'conditional' | 'fail' | 'skipped';
  patterns_hit: string[];              // from router
};
```

## Using the CLI

### Last 30 days summary
```bash
node scripts/ledger.js
```

Output:
```
=== LEDGER REPORT ===
Rows: 312
Window: last 30 days

--- PER MODEL ---
model         n     in tok       out tok      cost      pass%   esc   down
haiku-4.5     142   485,200      192,400      $1.16     94%       2     0
sonnet-4.6    127   612,800      318,200      $6.61     89%       8     3
opus-4.7      43    198,400      94,200       $10.04    91%       0     2

--- SAVINGS ---
Routed total cost:     $17.81
All-Opus baseline:     $43.42
Estimated savings:     59.0%  ($25.61)

--- VERIFIER HEALTH ---
Pass:        279  (89.4%)
Conditional: 24   (7.7%)
Fail:        9    (2.9%)

--- ROUTING ADJUSTMENTS ---
Escalations: 10  (3.2% of routes)
Downscales:  5   (1.6% of routes)

--- WASTE: TASKS THAT FAILED VERIFICATION (9) ---
  T-a1b2c3d4  [sonnet-4.6]  Implement OAuth login with Google in Next.js
  ... +8 more
```

### Single session
```bash
node scripts/ledger.js --session sess-build-landing-2026-05-17
```

### Since a date
```bash
node scripts/ledger.js --since 2026-04-01
```

### Just the waste
```bash
node scripts/ledger.js --waste
```

### Export to CSV (for spreadsheet analysis)
```bash
node scripts/ledger.js --csv > /tmp/ledger.csv
```

## Per-model pricing (May 2026 reference)

Built into `scripts/ledger.js`. Update when Anthropic changes prices:

```
Haiku 4.5:   input $0.80 / output $4.00   (per M tokens)
Sonnet 4.6:  input $3.00 / output $15.00
Opus 4.7:    input $15.00 / output $75.00
```

## Workflow integration

### After every God Mode session (automatic)
The `log-routing.js` hook fires per Task call. No manual action.

### Weekly (you)
```bash
node scripts/ledger.js                    # eyeball the week
node scripts/ledger.js --waste            # find verification failures
node scripts/route-learn.js               # update learned weights
```

### Monthly (you)
- Export to CSV, do per-task-class accuracy analysis
- Update router pattern weights manually for any pattern with >10% miss rate
- Add new adversarial cases to `evals/routing-eval.jsonl` for things the router got wrong
- Re-run `npm run eval:routing` to confirm gate (≥85% / ≥70%)

## Filling in tokens + cost

The hook writes rows with `input_tokens: null` because the Task-tool hook doesn't have visibility into subagent token usage. To get real numbers, two options:

1. **Wrap the Anthropic SDK** in your client and post token counts to `~/.themeetpatel/ledger.jsonl` keyed by `task_id`.
2. **Pull from Anthropic Console** (Usage tab) and join offline against ledger.jsonl by ts/session_id.

Both are post-v1.3 work. For now, the ledger captures *which* model was routed, *how often*, with *what verifier outcome*. Cost is estimated from token counts when present; otherwise the savings number uses default routing-ratio (1/5/15) math.

## Output contract (when this skill is invoked for a report)

```
═══ COST LEDGER REPORT ═══
Period: <window>  Generated: <date>

ROUTING DISTRIBUTION:
- Haiku: <n> (<%>)
- Sonnet: <n> (<%>)
- Opus: <n> (<%>)

COST:
- Routed total: $<n>
- All-Opus baseline: $<n>
- Savings: <%>  ($<n>)

VERIFIER HEALTH:
- Pass: <n> (<%>)
- Conditional: <n> (<%>)
- Fail: <n> (<%>)

ROUTING ADJUSTMENTS:
- Escalations: <n> (<% of routes>)
- Downscales: <n> (<% of routes>)

TOP WASTE:
- <task class> — <n> fails, $<n> spent
- <task class>

RECOMMENDATIONS:
- <pattern / class to investigate>
- <router weight to adjust>
- <new adversarial case to add to evals>

NEXT REPORT: <date>
```

## Anti-patterns

- ❌ Reporting savings % without absolute dollar figures
- ❌ Reporting verifier pass rate without sample size
- ❌ Ignoring verification failures because the cost was low
- ❌ Tuning router weights without adding eval cases for the change
- ❌ Treating estimated costs as exact (always say "estimated" or "approximate")

## Routing

- **Haiku**: report formatting, CSV exports
- **Sonnet**: default — analysis and recommendations
- **Opus**: only when ledger data drives a high-stakes decision (e.g., kill a model, change pricing tier)

## Verification

The verifier (class: data) will:
1. Confirm every reported metric has a sample size.
2. Confirm savings number is paired with absolute dollars, not just %.
3. Confirm verifier-pass percentages distinguish pass / conditional / fail.
4. Confirm recommendations name specific patterns or eval cases, not generic advice.
