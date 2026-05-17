---
name: screen-state-aware
description: Use when the runtime exposes the user's current screen (screenshot or DOM) — the system reasons about what's visible and proposes context-aware actions. "I see you're stuck on row 47 of this spreadsheet — want me to fix the formula?" Highest-leverage UX surface for in-flow help. Requires the host runtime to expose screen access with the user's consent.
preview: true
preview_reason: "Depends on host runtime screen-state APIs. Returns scaffold mode otherwise."
---

> ⚠ **PREVIEW** — Requires runtime screen access. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Screen-State Aware

The system that helps you with what's actually on your screen, in the moment, without being asked, is qualitatively different from the system that waits for queries.

## When to use

- Mid-work moments where the user is stuck and could use a nudge
- IDE / spreadsheet / browser sessions where context matters
- Following up on an error message the user is staring at
- Workflow handoffs ("I see you opened the deploy dashboard — want me to walk you through pre-flight?")

## When NOT to use

- Without explicit consent (this is observation, not magic)
- On sensitive surfaces (banking, healthcare, anything regulated)
- On other people's screens (only the user's own)
- When the user is in deep flow and unsolicited help would interrupt

## Runtime requirement

Requires the host runtime to expose a screen-state API:
- `getScreenshot()` — periodic or on-trigger image
- `getActiveAppContext()` — which app + which window/tab
- `getSelection()` — selected text if any

In Claude Code with the computer-use MCP, these are available. In other runtimes, this skill returns scaffold mode.

## The protocol

### Trigger modes

| Mode | When the system pipes up |
|---|---|
| **On-error** | The user's screen shows an error message — system offers diagnosis |
| **On-idle** | User hasn't moved for 90s+ on a stuck-looking screen — system suggests next step |
| **On-explicit** | User says "what should I do here" — system answers based on what's visible |
| **On-app-switch** | User switches to a known app (CRM, IDE, dashboard) — system primes a context-appropriate suggestion |
| **Silent** | System never volunteers — only responds when asked, using current screen as context |

Default mode is **silent**. The user opts in to more proactive modes.

### Output style

Always terse. The user is in flow:

```
[<app context>] I see <observation>.
Want to: <option A> | <option B> | nothing
```

Example:
```
[GitHub PR view] I see CI is red on `npm test` (3 failures).
Want to: pull repo + diagnose | open the failing test file | nothing
```

### Privacy invariants

- Screenshots stored in memory only — never written to disk unless the user explicitly saves
- PII redactor runs on every screenshot before logging
- A user-visible "screen access ON / OFF" indicator must be present in the host UI
- Screen access auto-pauses on sensitive apps (banking, password managers detected by app name)

## Anti-patterns

- ❌ Volunteering help every 30 seconds (annoying — let the user work)
- ❌ Acting on inferred state without verifying with the user first
- ❌ Storing screenshots persistently without explicit save
- ❌ Reading screen during private moments (banking, password reset, video call)
- ❌ Suggesting actions on apps the system doesn't have permission to touch

## Output contract

```
═══ SCREEN-STATE OBSERVATION ═══
App: <name>  Window: <title>  Observed at: <ts>

OBSERVATION (one sentence):
SUGGESTION (if any, one sentence):
ACTIONS OFFERED:
  A. <action>  → routes to: <skill or agent>
  B. <action>
  C. nothing (default if no response in 30s)

PROVENANCE: <which pixel region / DOM element triggered this>
PRIVACY: screenshot redacted: <yes/no>, stored: <no — memory only>
```

## Verification

The verifier (class: ops) will:
1. Confirm consent state is on for the current observation.
2. Confirm sensitive apps were skipped.
3. Confirm no PII left memory.
4. Confirm offered actions are within the user's existing approval scopes.

## Routing

- **Haiku** for the observation classification
- **Sonnet** for the suggestion
- The suggested action's own skill handles the rest
