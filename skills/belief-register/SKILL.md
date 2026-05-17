---
name: belief-register
description: Use to track explicit beliefs the CEO holds across sessions ("our ICP is X", "our funnel breaks at Y", "Postgres is the right DB for us") with timestamps, evidence, and a revision log when beliefs change. Different from memory (facts the user states) — beliefs are conclusions the SYSTEM reached and may need to revise. Held in ~/.themeetpatel/beliefs.jsonl.
---

# Belief Register

Memory stores what the user told the system. Beliefs are what the system has *concluded* about the user's world from observation. Beliefs decay, contradict, and need explicit revision. Most agent systems silently forget what they used to think; this one keeps the record.

## When to write a belief

- The CEO completed a session that produced a non-trivial conclusion ("based on T1.3 research, Sonnet is the right default for code generation")
- A specialist agent produced a high-confidence finding the system will act on next time
- A pattern emerged across 3+ sessions ("user's deadlines are usually 2× their initial estimate")
- The user contradicted a prior belief — write the new one, log the old

## When NOT to write

- Single-session opinions that won't carry forward
- Things already in `memory` (user-stated facts)
- Speculative inferences with no decision impact

## Belief schema

```jsonl
{"id":"b-001","ts":"2026-05-17T14:00:00Z","statement":"<one sentence>","scope":"user|project|domain","confidence":0.0-1.0,"evidence":["<source>","<source>"],"superseded_by":null,"superseded_at":null}
```

When a belief is revised:
```jsonl
{"id":"b-001","ts":"2026-05-17T14:00:00Z","statement":"X","superseded_by":"b-042","superseded_at":"2026-08-01T09:00:00Z"}
{"id":"b-042","ts":"2026-08-01T09:00:00Z","statement":"Y","supersedes":"b-001","evidence":[...]}
```

The original row is never deleted. The supersedes/superseded_by chain becomes the audit trail.

## Operations

### Read all active beliefs
```bash
node scripts/beliefs.js --active
```

### Add a belief
```bash
node scripts/beliefs.js --add "Postgres is the right DB for us" --scope project --confidence 0.85 --evidence "session-2026-05-17,session-2026-04-22"
```

### Revise a belief
```bash
node scripts/beliefs.js --revise b-001 --new "Planetscale is the right DB for us" --reason "Migrated in June 2026"
```

### Query
```bash
node scripts/beliefs.js --about "DB"
node scripts/beliefs.js --history b-001
```

## CEO integration

Phase 1 (Intake), after reading memory, the CEO reads active beliefs and folds them in:

```
"Based on belief b-042 (Planetscale is the right DB), I'll route DB-touching tasks accordingly."
```

If the user's current goal contradicts an active belief, the CEO surfaces it:

```
"Heads up: belief b-042 says Planetscale is the right DB, but you're asking about a Postgres migration. Want to revise the belief or scope this as a one-off?"
```

## Anti-patterns

- ❌ Writing every observation as a belief (beliefs are decisions to act on, not log entries)
- ❌ Confidence scores set to 1.0 ("certain") — almost nothing deserves that
- ❌ Beliefs that have no evidence linked
- ❌ Silently overwriting a belief without the superseded chain

## Output contract

When this skill runs as part of a session deliverable:

```
═══ BELIEF REGISTER ═══
Operation: <read|write|revise|prune>

ACTIVE BELIEFS RELEVANT TO THIS SESSION:
  b-042 (conf 0.85): Planetscale is the right DB for us  [evidence: 3 sessions]
  b-018 (conf 0.72): UAE SMB segment converts 2x faster than mid-market  [evidence: 4 sessions]

REVISIONS THIS SESSION:
  - none / b-001 → b-067 (replaced)

NEW BELIEFS WRITTEN:
  - b-068: <statement>  (confidence: 0.7, evidence: T1.3)

CONFIDENCE CALIBRATION:
  - Last 30 days: of beliefs at conf 0.8+, <%> still active and unrevised
  - Suggests confidence scoring is well/poorly calibrated
```

## Verification

The verifier (class: ops) will:
1. Confirm every new belief has at least one evidence link.
2. Confirm revisions preserve the supersedes chain.
3. Confirm confidence is in [0.0, 1.0] and not 1.0 unless explicitly justified.
4. Flag beliefs unused (not referenced in any session) for > 90 days as deprecation candidates.
