# Federated learning for the router (v1.5+ spec)

The router accuracy moat compounds when patterns learned on one user's sessions sharpen everyone's router. This doc specs how that happens without sharing user data.

## Privacy invariants

These are non-negotiable:

1. **No raw task text leaves the user's machine.** Ever.
2. **No PII leaves the user's machine.** Ever.
3. **What CAN leave (opt-in only):** anonymized pattern → model → verdict triples + counts.
4. **The user can audit and revoke at any time.**
5. **No federated signal is sent unless the user has explicitly opted in via `themeetpatel federated --enable`.**

## What gets shared (the only thing)

A weekly upload of:

```json
{
  "version": "fed-1",
  "instance_pseudonym": "<hashed, rotating>",
  "period": "2026-05-12..2026-05-19",
  "samples": [
    {
      "patterns": ["refactor", "tests"],
      "routed_model": "sonnet-4.6",
      "verdict": "pass",
      "n": 14
    },
    {
      "patterns": ["decide whether", "api"],
      "routed_model": "opus-4.7",
      "verdict": "pass",
      "n": 3
    }
  ]
}
```

Note: no task text, no goal text, no file paths, no user identity, no timestamps beyond the week. Just (pattern multiset, model, verdict) counts.

## What the aggregator does

A central aggregator (could be self-hosted or community-hosted):

1. Receives uploads
2. Re-aggregates across all opted-in instances
3. Publishes back: per-pattern accuracy by model + suggested weight adjustments
4. Anyone can download the published weights and merge into their `router-weights.json`

## What it doesn't do

- Doesn't see raw task text
- Doesn't see who you are
- Doesn't see what files you work on
- Doesn't see goals, code, decisions
- Doesn't store anything per-instance beyond aggregate counts

## Implementation outline (v1.5)

### Sender
```
scripts/federated-upload.js (runs weekly via cron):
1. Read ledger.jsonl
2. Aggregate by (patterns_hit, routed_model, verifier_verdict) → counts
3. Encrypt to aggregator pubkey
4. Upload to aggregator endpoint
```

### Aggregator (a thin server)
```
- Receives encrypted payloads
- Decrypts
- Adds to running totals (no per-instance retention)
- Daily: publishes router-weights.json as a public artifact
```

### Receiver (every instance)
```
scripts/federated-download.js (runs daily via cron):
1. Fetch latest weights
2. Merge with local router-weights.json (local wins on conflict; federated boosts confidence)
```

## Differential privacy (v1.6+)

Add noise to the per-instance counts before upload so even the aggregator can't infer per-user behavior with confidence. Epsilon-budget set by the user (default ε=1, strict ε=0.1).

## Self-hosted variant

For enterprises that want federated learning within their org but not externally:
- Spin up the aggregator inside the company VPC
- Point all employee instances at it
- Same protocol, no external dependency

## Why this is a moat

Models commoditize. Routers don't — because routing accuracy depends on observed reality, not on model capability. The aggregator's weights get sharper with every opted-in user. A new entrant starting from scratch has no path to catch up without their own user base.

This is the same shape that made Google Search defensible: query-result pairs over time.

## What v1.4 ships

- This spec (the artifact)
- Local aggregation script (just for the user's own sessions)
- Sample export format that COULD upload to a future aggregator

## What v1.5 ships

- Working sender + receiver
- Self-hosted aggregator reference implementation
- Opt-in CLI flow

## What v1.6 ships

- Differential privacy
- Cohort-specific weights (e.g., "router weights for UAE B2B founders")
- Reputation-based weighting (recent, high-volume instances weighted more)
