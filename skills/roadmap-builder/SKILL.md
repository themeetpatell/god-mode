---
name: roadmap-builder
description: Decompose any goal into a phased, dependency-aware roadmap of tasks ready for model routing and delegation. Use whenever a goal is large enough to need more than one task. Produces the input the model-router and CEO use.
---

# Roadmap Builder

Take a goal in plain English and produce a phased roadmap. This is what the CEO does in Phase 2.

## Decomposition heuristics

### Find the natural phases

Most goals fall into a small number of recurring shapes. Pattern-match first, then customize:

| Goal shape | Default phases |
|---|---|
| Build a feature/app | (1) Spec & decisions → (2) Scaffold → (3) Implement → (4) Test → (5) Polish & ship |
| Research → report | (1) Scope & questions → (2) Gather sources → (3) Synthesize → (4) Format deliverable |
| Refactor / cleanup | (1) Survey & map → (2) Decide target shape → (3) Refactor in slices → (4) Verify → (5) Cleanup |
| Debug / investigation | (1) Reproduce → (2) Isolate → (3) Diagnose → (4) Fix → (5) Regression test |
| Content / launch | (1) Strategy → (2) Draft assets → (3) Visuals → (4) Review → (5) Publish |
| Migration | (1) Inventory → (2) Plan cutover → (3) Migrate in batches → (4) Verify → (5) Decommission old |

If your goal doesn't pattern-match, decompose by **outcome** (what's true at the end of phase N that wasn't true at the start of phase N).

### Make every task atomic

A task is atomic if:

- One model can do it in one shot.
- It has a clear "done" condition (file exists, test passes, decision recorded).
- Its output can be checked without re-running it.

If a task fails any of these, split it.

### Surface dependencies explicitly

For each task, note what it needs:

- `T2.1 needs: T1.2` (output dependency)
- `T2.1 needs: human input` (waiting on user)
- `T2.1 needs: secrets/credentials` (external blocker)

This tells the CEO what can run in parallel and what must wait.

### Estimate before routing

For each task, jot a rough token estimate. Use these anchors:

| Task | Rough output tokens |
|---|---|
| 5-bullet summary | 100–300 |
| Status update | 50–150 |
| Small utility function | 300–800 |
| Production module (one file) | 1000–3000 |
| Refactor of an existing file | 1000–4000 |
| Architecture decision doc | 500–1500 |
| Research summary with citations | 800–2000 |

Sum across the roadmap for the EST. TOTAL TOKENS line.

## Output format

Hand the CEO a roadmap exactly in this shape:

```
GOAL: <one sentence>
ASSUMPTIONS: <only if any>

Phase 1: <name>            [parallel|sequential]
  T1.1  <task>                  needs: —              | est: ~<tokens>
  T1.2  <task>                  needs: —              | est: ~<tokens>

Phase 2: <name>            [parallel|sequential]
  T2.1  <task>                  needs: T1.1, T1.2     | est: ~<tokens>
  T2.2  <task>                  needs: T1.2           | est: ~<tokens>

Phase 3: <name>            [sequential]
  T3.1  <task>                  needs: T2.*           | est: ~<tokens>

EST. TOTAL OUTPUT TOKENS: ~<sum>
```

Routing is **not** part of this skill — it happens in the `model-router` skill after the roadmap is built. Keep concerns separate.

## Failure modes to avoid

- **Roadmap too granular.** 50 tasks for a one-day project is over-engineering. Aim for 5–15 tasks for most goals.
- **Roadmap too coarse.** "Phase 1: Build it" isn't a roadmap. Each phase has 2-5 atomic tasks.
- **Hidden dependencies.** If T3 secretly depends on a decision T1 was supposed to make, surface it.
- **Phases that don't change state.** Every phase should leave the system in a more advanced state than the previous one.
