---
name: model-router
description: The decision logic for picking the right Anthropic model (Haiku 4.5, Sonnet 4.6, Opus 4.7) per task. Use whenever the CEO is deciding how to delegate, or whenever the user asks "which model should I use for X". Optimizes for outcome quality at minimum token cost.
---

# Model Router

The single most important skill in the plugin. Every routing decision compounds across a roadmap.

## The Matrix

| Task signature | Model | Rough cost ratio* |
|---|---|---|
| Classify text into N buckets | Haiku 4.5 | 1× |
| Summarize a doc/PR/log in 5 bullets | Haiku 4.5 | 1× |
| Convert format (CSV↔JSON, MD↔HTML, code↔prose) | Haiku 4.5 | 1× |
| List entities (functions in a file, deps, files) | Haiku 4.5 | 1× |
| Write a status update, commit message, changelog line | Haiku 4.5 | 1× |
| Answer a factual question with no reasoning chain | Haiku 4.5 | 1× |
| Write a small utility function (< 50 lines, no design) | Haiku 4.5 | 1× |
| Lint-style or syntactic check | Haiku 4.5 | 1× |
| Write production code (one feature, ≤500 lines) | **Sonnet 4.6** | ~5× |
| Refactor existing code | **Sonnet 4.6** | ~5× |
| Write tests for known surface | **Sonnet 4.6** | ~5× |
| Write docs, README, runbook, API reference | **Sonnet 4.6** | ~5× |
| Research a topic with web search | **Sonnet 4.6** | ~5× |
| Read code → explain → suggest improvements | **Sonnet 4.6** | ~5× |
| Debug straightforward issue (clear repro, local cause) | **Sonnet 4.6** | ~5× |
| Architecture decision with long-term consequences | **Opus 4.7** | ~15× |
| Design a data model / API shape from scratch | **Opus 4.7** | ~15× |
| Debug hard issue (race condition, distributed bug, perf puzzle) | **Opus 4.7** | ~15× |
| Security review where false negatives are expensive | **Opus 4.7** | ~15× |
| Multi-constraint reasoning (works for A,B,C without breaking D) | **Opus 4.7** | ~15× |
| Tradeoff analysis surfacing what the answer depends on | **Opus 4.7** | ~15× |
| Strategic / product decisions with several layers of consequence | **Opus 4.7** | ~15× |

*Approximate output-token cost ratios. Input is even cheaper for Haiku relative to Opus.

## Default rule

**When uncertain, route to Sonnet.** It's the safest default in terms of quality/cost ratio.

## Routing decision algorithm

For each task in the roadmap, run this check in order:

1. **Is it pure formatting, stitching, listing, classifying, or summarizing?** → Haiku.
2. **Does getting it wrong cost more than the Opus token premium?** → Opus.
   (Architecture, security, hard debugging, anything with multi-step consequences.)
3. **Everything else** → Sonnet.

Then sanity-check:

- Did I route something to Opus that's actually mechanical? Downgrade to Sonnet.
- Did I route something to Haiku that needs even one inferential step? Upgrade to Sonnet.
- Did I route something to Sonnet that I'd be embarrassed to ship if it were wrong? Upgrade to Opus.

## Anti-patterns

- ❌ Defaulting to Opus "to be safe". You're not being safe, you're being expensive.
- ❌ Defaulting to Haiku to save money on tasks that genuinely need reasoning. You'll pay more in rework.
- ❌ Routing based on task length. A 1000-line refactor can be Sonnet; a 3-line architecture decision should be Opus.
- ❌ Routing the *same* task to multiple models "for consensus". Pick one. Escalate only if it fails.

## Parallel vs. sequential

After routing by model, decide parallelism:

- **Parallel** if tasks are independent (no shared state, no dependencies).
- **Sequential** if task N's output feeds task N+1.

Parallel execution doesn't change token cost but cuts wall time substantially. In Claude Code with the `Task` tool, spawn parallel workers in a single batch.

## Output

When the CEO uses this skill, it should produce a routing decision per task in this form:

```
T1.1  Summarize uploaded spec        → Haiku   (summarization)
T1.2  Research competing libraries   → Sonnet  (web search + analysis)
T2.1  Decide DB schema               → Opus    (architecture, long-term)
T2.2  Write migration files          → Sonnet  (production code)
T2.3  Write smoke tests              → Sonnet  (test scaffolding)
T3.1  Generate changelog entry       → Haiku   (formatting)
```

That's the model router skill. It's deceptively simple. Getting it right is what makes God Mode actually god-tier.
