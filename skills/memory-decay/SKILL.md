---
name: memory-decay
description: Forgetting curves for memory + beliefs. Facts/beliefs/episodes that haven't been reinforced for N days decay in confidence and eventually drop. Prevents memory from accumulating stale state forever. Backed by scripts/memory-decay.js run weekly.
---

# Memory Decay

A memory layer without forgetting is a junk drawer. This skill applies a simple decay function so the system gradually deprioritizes facts and beliefs that aren't reinforced.

## When to use

- Weekly maintenance (or via a watcher)
- Before a major fresh start (new project, new role)
- When the user says "things have changed, refresh"

## What gets decayed

| Item | Default half-life | Decay applies to |
|---|---|---|
| Memory facts (`stack`, `team`, `preferences`) | 180 days | Last-updated timestamp |
| Beliefs | 90 days | Last-reinforced timestamp |
| Episodes | 365 days | Access timestamp |

A fact is "reinforced" when:
- The user explicitly states it again
- A session uses it without contradiction
- A belief revision retains it

A belief is "reinforced" when:
- The CEO references it in a session
- Evidence is added
- It survives a sensitivity test in tree-of-thought

## Decay function

```
new_confidence = old_confidence × exp(-ln(2) × days_since_reinforcement / half_life)
```

When confidence drops below 0.3, the item is marked candidate for removal. When below 0.1, removal is automatic on next decay pass (with a log entry).

## CLI

```bash
node scripts/memory-decay.js                           # report only, no changes
node scripts/memory-decay.js --apply                   # actually update files
node scripts/memory-decay.js --apply --aggressive      # half-life * 0.5
```

## Reinforcement

When the CEO or a specialist agent reads a memory fact or belief during a session, the script can also bump the `last_reinforced` timestamp. This is an opt-in flag because reads shouldn't always count as reinforcement (we'd never forget anything).

The trigger for reinforcement is: a fact/belief is *acted on*, not just *seen*.

## Output contract

```
═══ MEMORY DECAY PASS ═══
Run mode: report | apply

ITEMS REVIEWED:
  Memory facts: <n>
  Beliefs: <n>
  Episodes: <n>

DECAYED:
  Memory facts dropped (conf < 0.1):  <n>  [list]
  Beliefs marked candidate (conf < 0.3): <n>  [list]
  Episodes archived (untouched > 365d): <n>

REINFORCEMENT EVENTS THIS PERIOD:
  Memory facts touched: <n>
  Beliefs acted on: <n>

NEXT DECAY PASS RECOMMENDED: <date>
```

## Anti-patterns

- ❌ Decaying beliefs the user explicitly pinned (mark as `pinned: true` to skip decay)
- ❌ Removing items without a log entry
- ❌ Aggressive decay on a brand-new system (give it 30 days of data first)
- ❌ Decaying memory tied to compliance (PII handling rules, regulatory facts)

## Verification

The verifier (class: ops) will:
1. Confirm decay applies only to items past half-life.
2. Confirm pinned items are preserved.
3. Confirm removed items have an audit log entry with timestamp + reason.
