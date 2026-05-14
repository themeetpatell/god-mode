# themeetpatel God Mode MCP Server

One MCP server that carries God Mode across Claude Desktop, Cursor, Cline, Windsurf, Continue, Zed, and any MCP-compatible client.

## What this adds

- **Deterministic model routing**: `route_task` returns Haiku/Sonnet/Opus with rationale, confidence, cost ratio, and escalation rule.
- **Persistent execution state**: sessions live in `~/.themeetpatel/sessions/` and can be resumed across clients.
- **Reusable prompt layer**: CEO prompt, routing matrix, specialist registry, skill registry, worker brief, and handoff brief are available as MCP prompts/resources.
- **No API key required**: this server does routing/state/prompt packaging. The client LLM still does the thinking/execution.

## Install

```bash
cd mcp-server
npm install
npm run build
```

## Claude Desktop config

Add this to your Claude Desktop MCP config:

```json
{
  "mcpServers": {
    "themeetpatel-god-mode": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/themeetpatel/mcp-server/dist/index.js"],
      "env": {
        "THEMEETPATEL_HOME": "$HOME/.themeetpatel"
      }
    }
  }
}
```

## Available tools

| Tool | Purpose |
|---|---|
| `route_task` | Pick Haiku/Sonnet/Opus for a task. |
| `create_roadmap` | Generate a routed roadmap and optionally save it. |
| `save_session` | Persist a roadmap/session. |
| `load_session` | Resume a session by ID. |
| `list_sessions` | Show recent sessions. |
| `update_task_status` | Mark tasks pending/in-progress/done/blocked. |
| `worker_brief` | Generate a minimal-context worker prompt. |
| `create_handoff` | Generate a portable brief for another tool. |
| `recommend_specialist` | Pick model + specialist agent for a task. |

## Available resources

- `themeetpatel://routing-matrix`
- `themeetpatel://prompts/ceo`
- `themeetpatel://specialists`
- `themeetpatel://skills`

## Available prompts

- `activate_god_mode`
- `handoff_brief`
- `choose_specialist`



## v1.1 specialist layer

The MCP server now exposes a domain-specialist layer in addition to model routing. The operating sequence is:

1. Route model by cost/depth: Haiku, Sonnet, or Opus.
2. Choose specialist by domain: product, growth, research, codebase audit, security, QA, DevOps, data, content, sales, UX, integrations, prompt systems, ops, or finance.
3. Use the narrow skill workflow when the task matches a repeatable pattern.

This mirrors the strongest Claude Skills pattern: small descriptions for progressive loading, explicit workflows, clear output contracts, and safe escalation.

## Architecture

The MCP server does not replace the client LLM. It gives the client a stable operating layer:

1. Client LLM receives goal.
2. Client calls `create_roadmap` or `route_task`.
3. Server returns routing/state/prompt structure.
4. Client executes using its own model/tooling.
5. Server persists status so another client can resume.

This keeps God Mode portable without forcing every runtime to support Anthropic subagents.
