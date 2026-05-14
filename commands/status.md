---
name: status
description: Show the current God Mode roadmap state — what's done, what's in progress, what's pending, and rough token spend so far.
---

# /status

**Usage:**

```
/status
```

## What this does

If God Mode is active in the current session, prints a quick state report:

```
GOAL: <one sentence>

Phase 1: <name>            [DONE]
  ✓ T1.1  <task>      → Haiku   (~120 tokens)
  ✓ T1.2  <task>      → Sonnet  (~1800 tokens)

Phase 2: <name>            [IN PROGRESS]
  ✓ T2.1  <task>      → Opus    (~900 tokens)
  → T2.2  <task>      → Sonnet  (running…)
  ⏳ T2.3  <task>      → Sonnet  (pending)

Phase 3: <name>            [PENDING]
  ⏳ T3.1  <task>      → Haiku
  ⏳ T3.2  <task>      → Sonnet

SPENT SO FAR: ~2820 tokens
ROUGH SAVINGS vs all-Opus: ~63%
```

If God Mode is not active, says so and suggests `/god-mode <goal>`.
