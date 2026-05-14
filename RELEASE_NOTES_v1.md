# themeetpatel v1.0 — God Mode MCP Upgrade

## Shipped

- Added full MCP server under `mcp-server/`.
- Added deterministic routing engine with confidence, rationale, cost ratio, and escalation rules.
- Added persistent cross-client sessions under `~/.themeetpatel/sessions/`.
- Added MCP tools: route, roadmap, save/load/list session, update task, worker brief, handoff.
- Added MCP resources: CEO prompt and routing matrix.
- Added MCP prompts: activate God Mode and handoff brief.
- Added example configs for Claude Desktop and Cursor.
- Added routing eval seed file.
- Added 100x operating playbook.

## Why it matters

v0.1 was a Claude Code plugin plus prompt pack. v1.0 is a portable operating layer. The same God Mode discipline can now travel across MCP-compatible tools while preserving state.

## Next best build

Build the cost ledger + eval harness:

- `~/.themeetpatel/ledger.jsonl` for every route decision.
- `npm run eval:routing` to validate model selection.
- Optional SQLite backend once sessions become serious.
