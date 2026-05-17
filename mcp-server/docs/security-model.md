# Security Model

The MCP server is intentionally low-risk by default. This doc describes the trust boundary, what's shipped today, and what's on the hardening roadmap.

## Trust model

| Dimension | Position |
|---|---|
| Caller | Trusted (the user's local LLM client) |
| Network | Local-only by default; no outbound calls without explicit future opt-in |
| Data sensitivity | User's own goals + roadmaps. May include sensitive context. |
| Storage | Local filesystem only (`~/.themeetpatel/`) |
| Auth | None required; relies on the user's file-system permissions |

## What the server does

- Computes routing decisions (pure function, no side effects beyond returning JSON).
- Builds roadmap/session JSON.
- Writes session state under `~/.themeetpatel/sessions/` or `THEMEETPATEL_HOME`.
- Writes audit events under `~/.themeetpatel/audit.jsonl`.
- Returns prompt text and handoff briefs.

## What the server does not do

- Does not call external LLM APIs (the client's LLM does the thinking).
- Does not read arbitrary user files (only its own state directory).
- Does not deploy code.
- Does not execute shell commands.
- Does not connect to third-party systems unless a future version explicitly adds approved downstream MCP clients.

## Filesystem permissions

The server only reads/writes inside `THEMEETPATEL_HOME` (defaults to `~/.themeetpatel/`):

```
~/.themeetpatel/
  sessions/<id>.json       ← roadmap state
  ledger.jsonl             ← routing + verifier outcomes (v1.3)
  audit.jsonl              ← per-tool-call audit (v1.3)
  routing.log              ← legacy routing log (backward compat)
  router-weights.json      ← learned router weights (v1.2)
  memory/default.json      ← persistent memory layer (v1.3)
  skill-loads.jsonl        ← skill telemetry (v1.3)
  installed-packs.json     ← installed Domain Packs registry (v1.3)
```

If you want to confine the server further, set `THEMEETPATEL_HOME` to a sandboxed directory.

## v1.3 hardening (this release)

### 1. Audit log
Every tool call writes a row to `~/.themeetpatel/audit.jsonl` with:
- timestamp
- session id
- tool name
- input hash (first 16 chars of SHA-256 — no raw input for privacy)
- status (`ok` / `denied` / `error` / `approved` / `rate_limited`)
- duration in ms
- reason (for denied/error)

The audit log is append-only and never read by the server. Users can inspect/export it for compliance.

### 2. Per-session tool budgets
Each tool has a max call count per session. Runaway loops (e.g., 500 calls to `route_task` in one session) are rate-limited with a `rate_limited` audit event. Default limits live in `src/audit.ts` and can be tuned.

| Tool | Limit (per session) |
|---|---|
| route_task | 200 |
| create_roadmap | 20 |
| save_session | 50 |
| load_session | 50 |
| list_sessions | 50 |
| update_task_status | 200 |
| recommend_specialist | 200 |
| create_handoff | 20 |
| worker_brief | 200 |

### 3. Approval gates (framework)
`src/audit.ts` exposes `requiresApproval(tool: string): boolean`. In v1.3, no tools require approval by default (writes are benign local file writes). The framework exists for v1.4 additions like a hypothetical `deploy_handoff` or `delete_session`.

Clients implementing approval gates should:
1. Call `requiresApproval(toolName)` before invoking
2. Prompt the user explicitly with the tool name + input summary
3. On user approval, invoke and record an `approved` audit event
4. On denial, record a `denied` audit event and don't invoke

## Future hardening (roadmap)

| Item | Target version |
|---|---|
| Manifest signing for tool descriptors | v1.5 |
| Encryption for saved session state | v1.5 |
| Optional E2E sync with explicit user consent (Supabase backend) | TBD |
| Per-tool RBAC for multi-user contexts | TBD |
| Secrets scanning on every write to memory.json | v1.4 |
| Tool budget configurability via env / config file | v1.4 |

## What you (the user) should know

- All state lives on your local machine. Delete `~/.themeetpatel/` to reset everything.
- The audit log captures hashes, not raw inputs. Your goal prompts aren't logged in clear.
- If you want to inspect what the server has stored: `ls -la ~/.themeetpatel/` and read the JSON files.
- If you want zero local persistence: set `THEMEETPATEL_HOME=/dev/null` (some operations will fail but routing will work).

## Reporting a vulnerability

Open an issue marked `[security]` on the repo, or DM the maintainer. Don't post exploit details publicly.
