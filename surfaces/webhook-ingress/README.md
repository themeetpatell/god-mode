# God Mode — Webhook ingress

Expose God Mode as a REST API so Zapier, Make, n8n, GitHub Actions, or any HTTP client can drive it.

## Setup

```bash
cd surfaces/webhook-ingress
export GOD_MODE_INGRESS_TOKEN="$(openssl rand -hex 32)"
echo "Save this token: $GOD_MODE_INGRESS_TOKEN"
node server.js
```

## Endpoints

### POST /v1/run

Run a God Mode session.

```bash
curl -X POST http://localhost:9876/v1/run \
  -H "Authorization: Bearer $GOD_MODE_INGRESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "goal": "Summarize today\'s GitHub releases", "async": false }'
```

Response:
```json
{
  "session_id": "ses-abc123",
  "goal": "...",
  "roadmap": { ... },
  "status": "..."
}
```

### POST /v1/route

Get a routing decision for a single task.

```bash
curl -X POST http://localhost:9876/v1/route \
  -H "Authorization: Bearer $GOD_MODE_INGRESS_TOKEN" \
  -d '{ "task": "Refactor the auth module" }'
```

### GET /v1/sessions/<id>

Get the state of a session.

### GET /healthz

Liveness check.

## Example: n8n integration

In n8n, add an HTTP Request node:
- URL: `http://your-server:9876/v1/run`
- Method: POST
- Auth: Header → `Authorization: Bearer <token>`
- Body: `{ "goal": "{{ $json.goal }}" }`

Then chain follow-up nodes off the response.

## Example: Zapier integration

Use the Webhooks by Zapier app:
- POST custom request
- Same URL + headers as above

## Auth + safety

- Token is required for every endpoint except /healthz
- Token is a long random string — rotate by restarting with a new env var
- No rate limit in v1.4 scaffold — add nginx or a reverse proxy in production
- Audit log every request to ~/.themeetpatel/audit.jsonl (when integrated with v1.5)

## Deploy options

- **Local** (laptop / dev machine): just `node server.js`
- **VPS / DigitalOcean**: docker container, behind nginx with HTTPS
- **Fly.io / Railway**: deploys directly from this folder

## What v1.4 ships

- Scaffold server (stub responses)
- README + examples
- Health check

## What v1.5 ships

- Real CEO loop integration
- Streaming responses (SSE) for long sessions
- Callback URLs for async results
- Per-token scope (which packs the token can use)
