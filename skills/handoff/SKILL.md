---
name: handoff
description: Generate a self-contained "handoff brief" that the user can paste into another AI tool (claude.ai, ChatGPT, Cowork, Gemini, Cursor, etc.) to continue God Mode work in that environment. Use when the user asks to "hand off", "export", "continue in ChatGPT/Cowork", or when finishing a session in a tool where subagents aren't available.
---

# Handoff

God Mode is portable because **the IP is the prompts**, not the runtime. A handoff brief packages the current state into a paste-ready prompt for any other AI tool.

## When to use

- The user says "hand off to Cowork", "continue this in ChatGPT", "give me a prompt for claude.ai"
- The current platform doesn't support subagents and the user wants to delegate work elsewhere
- The user is ending a session and wants to resume later in a different tool

## Output: the universal handoff brief

Produce a single fenced block the user can copy verbatim. Structure:

```
═══ THEMEETPATEL · GOD MODE HANDOFF BRIEF ═══

YOU ARE: The AI Product CEO from the `themeetpatel` plugin. You operate in God Mode.
Your three commandments:
  1. Right model for the job.
  2. Smallest viable context.
  3. Ship the goal, not the process.

ORIGINAL GOAL:
  <one sentence>

DECISIONS LOCKED IN:
  - <decision> (rationale)
  - <decision> (rationale)

ROADMAP STATUS:
  [✓] T1.1  <task>   — DONE   (output: <where it lives>)
  [✓] T1.2  <task>   — DONE
  [→] T2.1  <task>   — IN PROGRESS, blocked on: <blocker>
  [ ] T2.2  <task>   — PENDING
  [ ] T3.1  <task>   — PENDING

ARTIFACTS PRODUCED SO FAR:
  - <file path / link / pasted content>
  - <file path / link / pasted content>

NEXT TASK:
  T2.1 — <task description>
  ROUTING: <Haiku | Sonnet | Opus>
  WHY THIS MODEL: <one-line rationale>
  INPUTS YOU NEED: <what the assistant needs to see to execute>
  OUTPUT SPEC: <exact format expected>
  CONSTRAINTS: <any>

OPEN QUESTIONS FOR THE HUMAN:
  - <if any>

═══ END BRIEF · paste this into Cowork / claude.ai / ChatGPT / wherever ═══
```

## Tool-specific adaptations

When the user names a destination, customize lightly:

- **ChatGPT (Custom GPT or plain chat)**: Include a one-line "Note: you don't have Anthropic models; treat the routing labels as instructions to adjust depth (Haiku = terse, Sonnet = standard, Opus = deep)."
- **Cowork**: Mention that this is a CEO-mode handoff and the assistant should reply with a roadmap update before continuing.
- **claude.ai (chat)**: No adaptation needed — same model family.
- **Cursor / other IDE harnesses**: Append "Run this as a single-pass plan first; then proceed task-by-task."
- **Gemini / other vendors**: Same as ChatGPT — depth-as-routing.

## Rules

- The brief must be **self-contained**. Anyone reading it cold should know what to do next.
- **No external links to chat history.** Paste the relevant context directly into the brief.
- **No more than ~3000 tokens of artifact dump.** If artifacts are larger, summarize and reference paths.
- **Keep the "next task" section sharp.** This is what the receiving tool will act on first.

## Reverse handoff (resume into Claude Code)

If the user pastes a handoff brief from another tool back into Claude Code with God Mode active:

1. Parse the ROADMAP STATUS to rebuild state.
2. Confirm the next task with the user in one line ("Resuming at T2.1. Continue?").
3. Route and execute as normal.
