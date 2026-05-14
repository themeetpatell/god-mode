---
name: roadmap
description: Build a roadmap for a goal without executing it. Same decomposition and routing as /god-mode but stops after showing the plan. Use to review or edit the plan before committing tokens.
---

# /roadmap

**Usage:**

```
/roadmap <your goal>
```

## What this does

Runs the planning phases of God Mode but **does not execute**. You get:

1. Goal restated in one sentence
2. Assumptions, if any
3. Phased roadmap with task IDs, dependencies, model routing, and token estimates
4. Total estimated token cost and wall-time

Useful when:

- The goal is big and you want to sanity-check the plan first
- You want to edit the routing manually (e.g., force a task to Opus)
- You want to copy the roadmap into a doc/issue tracker before kicking off

## To execute after reviewing

Say "execute" or "ship it" — the CEO will pick up where it left off and start delegating.
