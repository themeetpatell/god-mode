---
name: handoff
description: Generate a paste-ready handoff brief to continue God Mode work in another AI tool (Cowork, claude.ai, ChatGPT, Cursor, Gemini, etc.).
---

# /handoff

**Usage:**

```
/handoff [destination]
```

Destinations: `cowork`, `claude.ai`, `chatgpt`, `cursor`, `gemini`, `generic` (default).

## What this does

Produces a single self-contained block of text capturing:

- The original goal
- Decisions locked in so far
- Roadmap status (done / in progress / pending)
- Artifacts produced
- The next task with routing, inputs, and output spec
- Any open questions

You paste it into the destination tool and the assistant there picks up where you left off.

## Why this is powerful

The plugin's IP isn't the runtime — it's the prompts. A handoff brief means God Mode goes wherever you go. Start a goal in Claude Code, continue it in ChatGPT on your phone, finish it in Cowork on your laptop.

See `skills/handoff/SKILL.md` for the brief format.
