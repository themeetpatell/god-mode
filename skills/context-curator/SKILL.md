---
name: context-curator
description: Use before any LLM call or worker delegation to compute the minimum viable context — minimum file set, glossary, decisions to preserve, and what to drop. Enforces commandment #2 ("smallest viable context") with concrete file-name and excerpt-range outputs, not vibes. The skill the cost ledger will show as the biggest savings lever.
---

# Context Curator

The third commandment of God Mode says "smallest viable context per task." Every other agent framework treats this as an aspiration. This skill makes it operational.

## When to use

- Before delegating to a Task worker in Claude Code
- Before any high-token LLM call in your own code (RAG, agent, multi-shot)
- When a worker keeps returning vague output despite a clear ask
- When the conversation has accumulated > 20K tokens
- When a roadmap touches a large codebase and each task only needs 2-3 files
- When the user pasted a giant doc and only asks one small question

## When NOT to use

- Single-turn Q&A in a short conversation (overhead exceeds value)
- When you've already curated context this turn

## The protocol

### 1. Read the worker's actual task

Strip the goal down to one sentence. What does the worker need to *do*? Not "what topic," but "what action."

### 2. Identify the minimum file / excerpt set

For code work:
```bash
# Find symbol references
grep -rn "<symbol>" --include="*.ts" --include="*.tsx" .
# Identify the 1-2 closest neighbors
# Pass file paths + line ranges, not the full files
```

For research / writing work:
- The source files
- The spec / target shape
- One example of acceptable output
- Skip: conversation history, brainstorm transcripts, the README

For decisions:
- Constraints
- Alternatives considered
- Data behind them
- Skip: rationale for past unrelated decisions

### 3. Build a glossary (when ≥3 named concepts)

For each domain term the worker needs to know about:
```
<term>: <one-line definition>
```

10 terms × 1 line = ~100 tokens. Replaces 2K+ tokens of source reading.

### 4. Name explicitly what to drop

Write down: "do NOT include X because Y." This forces discipline and lets the next reviewer audit your judgment.

### 5. Estimate the savings

```
Curated: ~<n> tokens
Naive (dump everything): ~<n> tokens
Savings: <%>
```

Without this number, the skill's value is invisible. With it, the ledger compounds the win.

## Worked example

Setup: 60-task session, conversation history is ~28K tokens, codebase has 84 files. Next task: "Add an `isAdmin` check to the dashboard route handler."

Naive worker brief (what most systems send):
- Full conversation history: 28K tokens
- The user's original goal restated: 200 tokens
- The roadmap so far: 1500 tokens
- All 84 files: 180K tokens
- Total: ~210K tokens, mostly noise

Curated worker brief (this skill):

```
═══ CURATED WORKER CONTEXT ═══
TARGET TASK: Add an isAdmin check to the dashboard route handler.
WORKER: sonnet-4.6

MINIMUM FILE SET (read in full):
- src/routes/dashboard.ts  (~800 tokens) — file to modify
- src/middleware/auth.ts   (~600 tokens) — where isAdmin is defined

EXCERPTS (these blocks only):
- src/types/user.ts:12-24  — User type with role field
- tests/routes/dashboard.test.ts:45-67 — existing tests for this route

GLOSSARY:
- User.role: "owner" | "admin" | "member" — string union
- isAdmin(user): helper in auth.ts returning boolean
- requireAuth: existing middleware to compose with

DECISIONS / CONSTRAINTS (preserve):
- Auth check returns 403 (not 401) for authed-but-unauthorized
- Tests must use the existing auth fixture in tests/fixtures/users.ts

OUTPUT FORMAT REQUIRED:
Patch to src/routes/dashboard.ts + matching test in tests/routes/dashboard.test.ts.
Return file diffs, not full files.

DROP:
- Conversation history (none of it constrains this change)
- All 82 other files (not touched)
- The roadmap (worker doesn't need to know about other tasks)

ESTIMATED CONTEXT SIZE:
- Curated: ~2,200 tokens
- Naive: ~210,000 tokens
- Savings: 98.9%

STATUS: done
```

The worker gets a sharp, scoped task. Output is better. Cost is 1/100th. This is what the savings claim actually means.

## Heuristics by worker type

| Worker | Min context recipe |
|---|---|
| Haiku formatter | The input only. Spec for the format. No history. |
| Haiku summarizer | The source. The target length. Nothing else. |
| Sonnet code-writer | Target file + 1-2 neighbors + the spec + test fixture if any |
| Sonnet researcher | Question + prior findings (curated) + source URLs |
| Opus architect | Constraints + 2-3 alternatives + data behind them + rejection criteria |
| Synthesizer | Worker outputs + the final shape spec. Not the original goal in full. |

## Anti-patterns

- ❌ Including "in case you need it"
- ❌ Pasting full files when a 30-line excerpt would do
- ❌ Including the routing matrix in a worker prompt (workers don't route)
- ❌ Re-pasting the user's original goal in full to every worker (one sentence is enough after Phase 1)
- ❌ Including unrelated files because "we already paid the read cost"
- ❌ Sending raw transcript instead of decisions extracted
- ❌ Skipping the savings estimate (you can't optimize what you don't measure)

## Output contract

Same as `agents/context-curator.md` — they're a matched pair.

## Routing

- **Haiku default** — this is structural pruning, not reasoning

## Verification

The verifier (class: ops) will:
1. Confirm minimum file set has rationale per file.
2. Confirm "drop" list is populated.
3. Confirm savings estimate is present (both numerator and denominator).
4. Confirm the curated context is actually smaller than naive (sanity check).

Fail if no "drop" rationale or if savings estimate missing.
