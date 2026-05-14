---
name: god-mode
description: Activate God Mode. Spins up the AI Product CEO, who builds a roadmap from your goal, routes every task to the optimal model (Haiku/Sonnet/Opus), delegates, and synthesizes the final deliverable.
---

# /god-mode

**Usage:**

```
/god-mode <your goal in plain English>
```

**Examples:**

```
/god-mode Build a Next.js landing page for a SaaS product, dark theme, with email signup
/god-mode Research the top 5 vector databases and recommend one for a 10M-doc RAG app
/god-mode Refactor my auth module to use OAuth, write migration tests, ship in branch
/god-mode Audit my codebase for security issues and produce a prioritized fix list
```

## What this does

Invokes the `god-mode-ceo` agent with your goal. The CEO will:

1. Restate your goal in one sentence (and ask up to 3 clarifying questions only if critical info is missing).
2. Build a phased roadmap with model routing per task.
3. Show you the roadmap (you can object; otherwise it proceeds).
4. Delegate each task to the cheapest model that can do it well:
   - **Haiku 4.5** for cheap/fast/format tasks
   - **Sonnet 4.6** for default coding and analysis
   - **Opus 4.7** for hard reasoning
5. Run independent tasks in parallel where possible.
6. Synthesize all outputs into a final deliverable + 5-line exec summary.

## Token discipline

Average savings on multi-task goals: ~30–60% vs. running everything on Opus, because the router downshifts ~half the work to Haiku/Sonnet. Your actual savings depend on the goal mix.

## Recovery

If a task fails, the CEO escalates to a stronger model, re-routes, or reports the blocker to you. Never silently swallows failures.

---

To use in plain chat without the slash form, just say: **"Activate God Mode. Goal: …"**
