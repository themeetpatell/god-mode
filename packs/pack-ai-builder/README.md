# pack-ai-builder

> God Mode pack for builders shipping AI-native products on Claude, OpenAI, MCP, or agent harness stacks.

## ICP

You're building an AI product. You ship MCP servers, Claude skills, agent harnesses, eval suites, or RAG systems. You want the CEO to know that "tool design" and "prompt design" and "eval design" are first-class deliverables, not afterthoughts.

## What this pack adds

| Component | Type | Purpose |
|---|---|---|
| `mcp-server-architect` | agent | MCP server design: tool/resource/prompt boundaries, idempotency, auth, sandboxing, examples per client. |
| `eval-harness-designer` | agent | Designs eval suites with stratification, adversarial cases, ground-truth strategy, and CI gating. |
| `agent-harness-builder` | agent | Designs multi-agent harnesses: routing, handoffs, memory, state, recovery semantics. |
| `prompt-debugger` | agent | Diagnoses why a prompt is producing a certain failure mode and prescribes minimal-diff fixes. |
| `skill-packager` | agent | Packages reusable behavior as progressive-loading skills with frontmatter, examples, and verifiers. |
| `claude-api-patterns` | skill | Tool use, prompt caching, streaming, batch, structured outputs, vision, files. |
| `mcp-client-config-patterns` | skill | Per-client config examples (Claude Desktop, Cursor, Cline, Continue, Zed, Windsurf) with gotchas. |
| `eval-stratification` | skill | How to build a 50/200/1000-case eval that actually catches regressions. |
| `agent-trace-debugging` | skill | Reading agent traces (Task tool spans, tool calls) to find the failing hop. |

## Install (target syntax for v1.3)

```
/plugin install themeetpatel-ai-builder@themeetpatel
```

## Status

v0.1 — pack structure shipped. Agents/skills are stubs; full content lands in v1.3.

## Why this exists

The flat `mcp-builder` skill in v1.1 was a 26-line template. Building real MCP servers requires opinions about auth, sandboxing, per-client configs, eval gates, security model. That's a pack, not a skill.
