# Security Model

The MCP server is intentionally low-risk by default.

## What it does

- Computes routing decisions.
- Builds roadmap/session JSON.
- Writes session state under `~/.themeetpatel/sessions/` or `THEMEETPATEL_HOME`.
- Returns prompt text and handoff briefs.

## What it does not do

- It does not call external LLM APIs.
- It does not read arbitrary user files.
- It does not deploy code.
- It does not execute shell commands.
- It does not connect to third-party systems unless a future version explicitly adds approved downstream MCP clients.

## Future production hardening

- Manifest signing for tool descriptors.
- Approval gates for write/delete/deploy tools.
- Tool budget per session.
- Audit log in `~/.themeetpatel/ledger.jsonl`.
- Optional encryption for saved session state.
