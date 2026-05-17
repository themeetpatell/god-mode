# God Mode — Open REST API spec

The MCP server is for MCP clients. The Open API is for everyone else: webhooks, mobile, browser extension, embedded widget, integrations.

The webhook ingress (`surfaces/webhook-ingress/server.js`) is the v1.4 scaffold; this doc is the full v1.5 contract.

## Base

```
https://<your-instance>/v1
```

All requests:
- `Authorization: Bearer <token>` required
- `Content-Type: application/json`
- Idempotency-key supported on mutating endpoints

## Endpoints

### POST /v1/run

Run a full God Mode session.

Request:
```json
{
  "goal": "Build a Next.js landing page with email signup",
  "constraints": "Dark theme; deploy-ready for Vercel",
  "pack": "core",
  "memory_overrides": { /* optional per-session fact overrides */ },
  "budget_usd": 5.0,
  "async": false,
  "callback_url": "https://your-app.com/webhook/god-mode"
}
```

Response (sync):
```json
{
  "session_id": "ses-abc123",
  "status": "completed",
  "roadmap": { "phases": [...] },
  "deliverable": "...",
  "exec_summary": {
    "done": "...",
    "shipped": [...],
    "verified": { "T1.1": "pass", "T2.1": "pass" },
    "cost_usd": 0.41,
    "time_seconds": 1122,
    "next": "..."
  }
}
```

Response (async, with `async: true`):
```json
{
  "session_id": "ses-abc123",
  "status": "queued",
  "estimated_cost_usd": 0.40,
  "estimated_time_seconds": 1100,
  "callback_url": "https://your-app.com/webhook/god-mode"
}
```

Callback (when done):
```json
{
  "session_id": "ses-abc123",
  "status": "completed",
  "deliverable": "...",
  "exec_summary": {...}
}
```

### POST /v1/route

Get a routing decision for one task.

Request:
```json
{ "task": "Refactor the auth module to use OAuth", "complexity": "medium", "stakes": "medium" }
```

Response:
```json
{
  "model": "sonnet-4.6",
  "confidence": 0.84,
  "rationale": "...",
  "patterns_hit": ["refactor"],
  "cost_ratio": 5
}
```

### POST /v1/verify

Verify a deliverable against acceptance criteria.

Request:
```json
{
  "task_class": "code",
  "deliverable_path": "/path/to/repo",
  "test_command": "npm test"
}
```

Response: per the verifier output contract.

### POST /v1/roadmap

Build a roadmap without execution.

Request: same as /v1/run, returns just the roadmap.

### GET /v1/sessions

List recent sessions.

```
?limit=20&since=2026-05-01&pack=core
```

### GET /v1/sessions/<id>

Get a session's full state + deliverable.

### POST /v1/handoff

Generate a handoff brief.

Request:
```json
{ "session_id": "ses-abc", "destination": "chatgpt" }
```

### GET /v1/ledger/summary

Cost ledger summary.

```
?period=30d
```

### GET /v1/packs

List installed packs.

### POST /v1/packs/install (admin scope)

Install a pack.

### POST /v1/memory (admin scope)

Read or write memory facts.

### POST /v1/beliefs (admin scope)

Read, add, revise beliefs.

## Streaming

For long sessions, support Server-Sent Events:

```
GET /v1/sessions/<id>/stream
```

Streams per-phase progress, verifier verdicts, and the final deliverable.

## Auth + scope

Token scopes (set when issuing the token):
- `read:sessions`
- `write:sessions` (run, route, verify, roadmap)
- `admin:memory`
- `admin:beliefs`
- `admin:packs`
- `admin:budgets`

Scoping prevents a webhook token from accidentally modifying the user's memory.

## Rate limits

Default per-token:
- 100 requests / minute
- 1,000 requests / day
- $100 / day spend cap

Per-org caps additionally apply.

## Versioning

`/v1` is stable. Breaking changes ship at `/v2`. We keep `/v1` for 12 months after `/v2` ships.

## Errors

Typed JSON:
```json
{ "error": { "code": "RATE_LIMITED", "message": "...", "retryable": true, "retry_after_seconds": 60 } }
```

Codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `BUDGET_EXCEEDED`, `INVALID_INPUT`, `INTERNAL_ERROR`.

## What v1.4 ships

- This spec
- Scaffold server at `surfaces/webhook-ingress/server.js` for /run, /route, /sessions

## What v1.5 ships

- Full implementation of every endpoint above
- SSE streaming
- Per-token scope enforcement
- Rate limits

## What v1.6 ships

- OpenAPI 3.1 spec file (machine-readable)
- Auto-generated TypeScript + Python clients
- Postman collection
