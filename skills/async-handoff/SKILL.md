---
name: async-handoff
description: Use to package work for a NEXT worker (human or AI) so they can pick up exactly where you left off — without you being there. Extends the v1.0 handoff skill with explicit knowledge transfer, decision rationale chain, and "what I would do next" notes. Designed for human ↔ AI ↔ AI chains across hours or days.
---

# Async Handoff

The v1.0 `handoff` skill is for "switch tools mid-session." This is for "switch *people* mid-project" — including AI → human, human → AI, AI → AI across time.

## When to use

- End of day, knowing tomorrow you'll continue
- Closing a working session with a customer / partner who'll pick up where you left off
- Passing a task to a teammate (or their AI instance via A2A)
- Pausing a long-running task for a human gate (HITL checkpoint)

## When NOT to use

- Short pause (< 30 min) where the same person resumes
- Tool switch within a session (use `handoff`)
- Quick action approvals (use `external-actions`)

## What goes in (beyond v1.0 handoff)

The base handoff brief captures *state*. Async handoff adds three things:

1. **Knowledge transfer** — what the next person needs to know that isn't in the artifacts (gotchas, customer context, "Sarah said the deadline moved")
2. **Decision rationale chain** — for every locked-in decision, why this not that, with confidence level
3. **What I would do next** — the receiver's first 30 min should be obvious

## Output contract

```
═══ ASYNC HANDOFF ═══
From: <person/AI/instance>  → To: <person/AI/instance>
Project: <slug>  Sent: <ISO>  Expected response window: <hours/days>

PROJECT STATE
─────────────
Original goal: <one sentence>
Current phase: <which roadmap phase>
% complete: <%>

WHAT'S DONE (by task ID):
  T1.1 ✓ <one line>     verified: pass
  T1.2 ✓ <one line>     verified: conditional
  T2.1 ✓ <one line>     verified: pass

WHAT'S IN PROGRESS:
  T2.2 → <one line>  blocked on: <thing>  expected: <when>

WHAT'S NEXT (the first 30 min of the receiver):
  1. <specific action>
  2. <specific action>
  3. <specific action>
  Estimated time: <minutes>
  Tools needed: <list>

DECISION RATIONALE CHAIN
────────────────────────
D1 — <decision>  (locked in T1.3)
  Why: <2 sentences>
  Alternatives: <X rejected because…, Y rejected because…>
  Confidence: <high/medium/low>
  Reversible: yes / no

D2 — <decision>  (locked in T2.1)
  ...

KNOWLEDGE TRANSFER (things not in the artifacts)
────────────────────────────────────────────────
- <gotcha 1>
- <customer context>
- <upcoming deadline / commitment>
- <person-specific quirk> ("Fatima prefers WhatsApp over email")
- <thing that changed recently> ("we moved off Stripe to Tabby last week")

OPEN QUESTIONS FOR THE RECEIVER
───────────────────────────────
Q1: <question>  — needed-by: <date>
Q2: <question>  — needed-by: <date>

ARTIFACTS (paths/links, not contents)
─────────────────────────────────────
- <path/url>
- <path/url>

CHECKPOINTS PENDING
───────────────────
C3: <topic> — your call on options A/B/C  → my recommendation: B
   why: <one sentence>

CONTEXT TO PRESERVE FOR THE NEXT NEXT PERSON
────────────────────────────────────────────
(If you (the receiver) hand off to a third party, copy the above + add your own
DECISIONS, KNOWLEDGE TRANSFER, and WHAT'S NEXT sections.)

SENT BY: <name/instance>
FOR QUESTIONS: <how to reach me, latency expectation>
```

## Receiver checklist (the first thing the receiver does)

```
RESUME PROTOCOL
───────────────
1. Read this brief end to end (5 min)
2. Skim the artifacts named above (10 min)
3. Open the first item from "WHAT'S NEXT"
4. If anything is unclear, write a one-line clarification request and send back BEFORE starting work
5. Update this brief with your own additions before YOU hand off
```

## Anti-patterns

- ❌ Asking the receiver to "read the entire conversation history" (do the curation FOR them)
- ❌ Decisions with no rationale ("we decided X" without why)
- ❌ Knowledge transfer that's just opinions, not facts
- ❌ "Up to you" on every checkpoint (give your recommendation; let them override)
- ❌ Brief longer than 2 pages (anything more, the receiver's first task is just reading)
- ❌ No expected response window (uncertainty kills async)

## Verification

The verifier (class: ops + comms) will:
1. Confirm the brief has all 7 sections populated.
2. Confirm "what's next" is concrete (not "continue the work").
3. Confirm decision rationale exists for every locked-in decision.
4. Confirm knowledge transfer items aren't opinions/vibes (concrete facts only).
5. Confirm checkpoints pending have a sender recommendation.

## Routing

- **Sonnet** for drafting
- **Opus** only if the project state is complex enough that the brief itself is a strategic communication
