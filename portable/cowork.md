# God Mode for Cowork

Cowork (Anthropic's desktop tool for file/task automation) runs on Anthropic models, so the routing labels translate to **actual style adjustments** even though Cowork doesn't expose subagent delegation.

## Setup

1. Open Cowork → create or open a workspace
2. Find the workspace **instructions** field (usually in workspace settings)
3. Paste the contents of `portable/universal-system-prompt.md` (everything between the `## SYSTEM PROMPT` and `## END SYSTEM PROMPT` markers)
4. Save

## Activation

In any chat with that workspace, just say:

```
Activate God Mode. Goal: <your goal>
```

Or use the shorthand:

```
/god-mode <your goal>
```

## What works well in Cowork

Cowork's strengths align with God Mode's design — it's already file- and task-oriented. Cases where this combo shines:

- **"Organize and tag my Downloads folder by file type, then write a summary report"** — Haiku for classification, Sonnet for the report.
- **"Read these 4 PDFs, extract the key claims, draft a synthesis doc"** — Haiku per-doc extraction, Opus for synthesis.
- **"Audit this codebase folder, produce a security writeup, and stage commits with fixes"** — Sonnet for survey, Opus for the audit, Sonnet for fixes.

The CEO's roadmap step naturally maps to Cowork's task model.

## Caveats

- Single-model context: Cowork serves one Anthropic model per chat. The routing labels guide **style**, not actual model swaps. The decomposition + dependency tracking + exec summary benefits all still apply.
- For real multi-model routing across Haiku/Sonnet/Opus, use the Claude Code plugin (the full `themeetpatel` plugin with subagents) — Cowork doesn't expose that today.

## Handoff back to Claude Code

If you're working in Cowork and want to switch to Claude Code for true subagent execution, say:

```
/handoff cursor
```

(Or `/handoff generic` for a tool-agnostic brief.) The CEO will produce a paste-ready brief.
