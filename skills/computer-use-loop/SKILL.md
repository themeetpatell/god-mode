---
name: computer-use-loop
description: "Use when a task requires driving the user's browser or desktop (clicking, typing, navigating, filling forms, downloading, screenshotting) under approval gates. Wraps the underlying computer-use tools with a safety pattern: state, action, screenshot, verify, approval-on-mutation. Scaffold in v1.4 — depends on the host runtime exposing computer-use primitives."
preview: true
preview_reason: "Requires host runtime computer-use primitives. Returns scaffold mode when unavailable. Real wiring lands in v1.4."
---

> ⚠ **PREVIEW** — Production wiring lands in v1.4. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md). Today this skill returns scaffold-mode output unless your runtime exposes computer-use primitives.


# Computer Use Loop

The gap between "drafts an email" and "sends an email" is everything. This skill closes it — under explicit approval gates and with a screenshot audit trail.

## Runtime requirement

Requires the host runtime to expose computer-use primitives (e.g., Claude Code's `computer-use` MCP). If those tools aren't available, this skill returns a "scaffold mode" output that the user runs manually.

## When to use

- Filling a form on a third-party site that has no API
- Driving an app's UI to do work the user would otherwise do
- Multi-step browser flow (login → navigate → click → extract)
- Test execution against a UI (paired with `webapp-testing`)
- Recurring "I do this 5 clicks every Monday" automation

## When NOT to use

- Anything an API call could do (always prefer API)
- Financial transactions, payments, irreversible deletions (refuse; route to user)
- Data exfil from systems the user doesn't own

## The loop pattern

```
1. STATE: take a screenshot, name what's on screen
2. PLAN: name the next single action ("click 'Submit' button at coords X,Y")
3. APPROVAL GATE (if mutation): pause, show user the planned action, wait
4. ACT: execute the single action via computer-use tool
5. WAIT: let UI settle (250-2000ms based on context)
6. VERIFY: take a screenshot, confirm expected state change occurred
7. LOG: append to ~/.themeetpatel/computer-use-log.jsonl
8. LOOP: if goal not done and no error, back to step 1
```

## Safety rules

These are HARD. The skill refuses if any is violated:

| Rule | Why |
|---|---|
| Approval gate on every action that writes / mutates / sends / pays | User must consent to each mutation |
| Maximum 20 actions per session without re-approval | Prevent runaway loops |
| No actions on banking / brokerage / crypto sites without explicit per-action user approval | Money requires human-in-loop |
| No actions on email / messaging that send to external recipients without per-action approval | Comms requires human-in-loop |
| Auto-abort if 2 consecutive verify steps fail | UI changed unexpectedly; stop |
| Auto-abort if the page URL changes to anything matching `*/login`, `*/checkout`, `*/billing` mid-task without explicit approval | Avoid auth/billing surprises |
| All screenshots redact via PII-redactor before logging | Audit log shouldn't contain raw PII |

## Output contract

```
═══ COMPUTER-USE SESSION ═══
Goal: <one sentence>
Mode: live | scaffold (manual)

STARTING STATE (screenshot ref): <screenshot-1.png>

ACTIONS TAKEN:
  A1  [click]  "Submit" at (847, 412)  — approved 14:22:01
       verify: form cleared, success message shown
       screenshot: screenshot-2.png
  A2  [type]   "search query" in field "q"  — auto (read-only, no approval)
       verify: input value updated
       screenshot: screenshot-3.png
  A3  [click]  "Send email to client" — REQUIRED APPROVAL, user approved 14:22:34
       verify: email sent confirmation
       screenshot: screenshot-4.png

ABORTED: no | yes (reason: <>)
FINAL STATE: <description>
ACTIONS LOGGED TO: ~/.themeetpatel/computer-use-log.jsonl

POST-CHECK:
  - <what the user should verify themselves>
  - <where to find the trail>
```

## Scaffold mode (when computer-use isn't available)

Returns a step-by-step manual the user runs themselves:

```
SCAFFOLD: COMPUTER-USE NOT AVAILABLE IN THIS RUNTIME

Goal: <one sentence>
Estimated steps: 8
Time estimate: 4-6 min

Step-by-step:
1. Open <URL>
2. Click "Submit"
3. Wait for form to clear
4. Enter "search query" in field labeled "Search"
5. ...

After running this manually, paste the final screenshot back into the chat and I'll verify the goal completed.
```

## Per-class verifier integration

The verifier (class: code + ops) will:
1. Confirm every action that mutated/sent/paid was logged with approval timestamp.
2. Confirm screenshots before and after key actions exist.
3. Confirm no banking/messaging actions without approval.
4. Confirm abort triggers fired appropriately on verify failures.

## Anti-patterns

- ❌ "Just click around until it works" — every action is explicit and planned
- ❌ Skipping screenshots to save time (the audit trail IS the safety)
- ❌ Auto-approval on mutation (the framework is designed around explicit consent)
- ❌ Trying to log into someone else's account (refuse)
- ❌ Scraping user data from sites they don't own (refuse)

## Routing

- **Opus** for the planning loop (next action requires judgement)
- **Sonnet** for typing / form fill
- **Haiku** for verify-after-screenshot pattern matching

## Roadmap

v1.4: scaffold + safety rules + log schema
v1.5: real integration with Claude Code computer-use tools
v1.6: cross-platform (desktop, mobile via remote-control protocol)
