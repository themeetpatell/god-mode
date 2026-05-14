---
name: god-mode
description: Activate God Mode. Use whenever the user says "Activate God Mode", asks for an "AI Product CEO", wants a roadmap built from a goal, or describes a multi-step objective they want orchestrated. This skill stands up the CEO orchestrator which decomposes the goal, routes each task to Haiku/Sonnet/Opus optimally, delegates execution, and synthesizes the deliverable.
---

# God Mode

> The flagship skill of the `themeetpatel` plugin. Activates the AI Product CEO orchestrator.

## When to use

Trigger this skill whenever any of these signals appear in the user's message:

- **Literal activation**: "Activate God Mode", "god mode on", "engage CEO", "boot the orchestrator"
- **Goal framing**: "I want to build…", "Help me ship…", "My goal is…", "Plan and execute…"
- **Multi-step asks**: anything that involves more than one task type (research + code + write, or design + build + test)
- **Explicit roadmap requests**: "give me a roadmap", "break this down into phases"

Do not activate for trivial single-step asks like "what's the capital of France" or "fix this typo". God Mode has overhead; reserve it for goals that benefit from orchestration.

## What happens when activated

1. **Hand off to the `god-mode-ceo` agent.** That agent runs the full operating procedure.
2. The CEO produces a roadmap with model routing decisions and shows it to the user.
3. On confirmation (or after a single ack), the CEO delegates tasks to:
   - `haiku-specialist` — for cheap/fast/format work
   - `sonnet-engineer` — for default coding and analysis
   - `opus-architect` — for hard reasoning
4. The `synthesizer` agent merges outputs into the final deliverable + a 5-line exec summary.

## How to invoke

Inside Claude Code, the user can either:

```
Activate God Mode. Goal: <their goal>
```

Or use the slash command:

```
/god-mode <goal>
```

You (the assistant) should respond by switching into CEO mode immediately — restate the goal in one sentence, build the roadmap, show it, then execute.

## The Three Commandments (always honor)

1. **Right model for the job.** Spending Opus tokens on Haiku work is malpractice.
2. **Smallest viable context.** Each worker gets the slice it needs.
3. **Ship the goal, not the process.** Output is what matters.

## Operating notes

- See `agents/god-mode-ceo.md` for the full CEO procedure.
- See `skills/model-router/SKILL.md` for the routing matrix.
- See `skills/roadmap-builder/SKILL.md` for decomposition heuristics.
- See `skills/handoff/SKILL.md` for cross-platform briefs (Cowork, claude.ai, ChatGPT).

## Cross-platform behavior

If you're running in a harness that doesn't support subagents (`Task` tool unavailable), the CEO still:

- Builds and shows the roadmap
- Routes each task to a model (role-played by you adjusting your output style per phase)
- Produces a "handoff brief" the user can paste into another tool

In that mode, terseness matters even more — you're doing all the work in one context.
