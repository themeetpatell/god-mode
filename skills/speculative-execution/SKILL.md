---
name: speculative-execution
description: Start the likely-next-task while the user is reviewing the current one. Trade marginal extra cost for reduced wall time. Only safe for read-only / no-side-effect tasks; never speculate on mutating actions. Used by the CEO when wall time matters more than the 10-20% incremental cost.
---

# Speculative Execution

If the user is staring at a 200-line research brief, they're probably going to ask for "summarize this for LinkedIn" or "what's the next move" next. We can have it ready by the time they ask.

## When to use

- User is mid-review of a long deliverable (likely to ask for compression or next-step)
- Roadmap has high-confidence "what's next" after each phase
- Demo / interview situations where wall time is the perceived value
- Long-running task waiting on a checkpoint — speculate the post-checkpoint work

## When NOT to use

- Anything with side effects (NEVER speculate on writes, sends, deploys)
- Tasks where the next step genuinely depends on user choice
- Cost-sensitive sessions
- Sessions tagged `no-speculate`

## The protocol

### Step 1 — Identify the likely next task

Heuristics:
- After a research brief → user usually asks for "summary for X audience" or "recommend"
- After a roadmap → user usually approves and asks to start
- After Phase N completion → user usually asks for status or to start Phase N+1
- After a decision doc → user usually asks for implementation roadmap

The CEO scores candidate next-tasks based on past behavior (from episodic memory). If top candidate > 70% historical probability, speculate.

### Step 2 — Run in shadow

Start the next task in the background. Use `scripts/long-task.js` for tasks > 30s, inline for shorter.

The speculation runs at one tier lower than the actual would (Sonnet → Haiku, Opus → Sonnet) unless the user has explicitly opted into full-tier speculation.

### Step 3 — Either reveal or discard

When the user asks for something:
- If their ask matches the speculation: present the cached result, mention "this was already started while you were reading"
- If their ask differs: discard the speculation, run fresh, log the miss for next time's heuristics

### Step 4 — Cost accounting

Track speculation hit rate. If hit rate < 30% over 30 days, the speculation isn't paying off — auto-disable that category of speculation.

## Output contract

```
═══ SPECULATION ═══
Triggered by: <user mid-review of T2.1>
Speculated next: <task description>
Started: <ts>
Estimated extra cost: $<n>
Cached output ready: <yes/no>

ON USER ASK:
  Match: <yes - reveal | no - discard>
  Hit rate (this category, 30d): <%>
```

## Anti-patterns

- ❌ Speculating on mutating actions (REFUSED in the framework)
- ❌ Speculating without a hit-rate floor (wastes money on uncorrelated guesses)
- ❌ Showing speculative results before the user asks (presumptuous, breaks trust)
- ❌ Speculating on user state the system can't see (browser tabs, off-system context)
- ❌ Hiding speculation cost in the session summary

## Safety constraint

The speculation queue is HARD-LIMITED to:
- ≤ 1 speculation in flight per session
- ≤ $0.20 per speculation
- ≤ Sonnet tier (no speculative Opus)
- 0 speculations on any task that would touch external systems

## Verification

The verifier (class: ops) will:
1. Confirm no mutating speculations were started.
2. Confirm tier downgrade was applied.
3. Confirm hit-rate tracking is updating.
4. Confirm cost-accounting includes speculation overhead.

## Routing

- Speculation strategy decisions: Haiku (mechanical)
- The speculated task itself routes normally (but tier-downgraded)
