/**
 * God Mode — webhook ingress server.
 *
 * POST a JSON goal to /v1/run, get back a roadmap (and optionally execute).
 * Allows God Mode to be a node in Zapier/Make/n8n/webhook-driven pipelines.
 *
 * Auth: bearer token from env (GOD_MODE_INGRESS_TOKEN).
 *
 * v1.4 scaffold — returns a stub roadmap. v1.5 wires through to the real CEO.
 *
 * Endpoints:
 *   POST /v1/run       { goal, constraints?, async?, callback_url? }    → roadmap + (if not async) deliverable
 *   POST /v1/route     { task, complexity?, stakes? }                   → routing decision
 *   GET  /v1/sessions/<id>                                              → session state
 *   GET  /healthz                                                       → ok
 */

const http = require('http');
const crypto = require('crypto');

const TOKEN = process.env.GOD_MODE_INGRESS_TOKEN;
const PORT = process.env.PORT || 9876;

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => body += c);
    req.on('end', () => resolve(body));
  });
}

function jsonResponse(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function authed(req) {
  const h = req.headers['authorization'] || '';
  return TOKEN && h === `Bearer ${TOKEN}`;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/healthz') return jsonResponse(res, 200, { ok: true, version: '0.1.0' });
  if (!authed(req)) return jsonResponse(res, 401, { error: 'Unauthorized — set Authorization: Bearer <GOD_MODE_INGRESS_TOKEN>' });

  if (req.method === 'POST' && req.url === '/v1/run') {
    const body = JSON.parse(await readBody(req));
    if (!body.goal) return jsonResponse(res, 400, { error: 'Need { goal }' });
    const sessionId = 'ses-' + crypto.randomBytes(4).toString('hex');
    // v1.4 scaffold: return a stub roadmap
    jsonResponse(res, 200, {
      session_id: sessionId,
      goal: body.goal,
      roadmap: {
        note: 'v1.4 scaffold — stub roadmap. In v1.5 this invokes the real CEO and returns the full plan.',
        phases: [
          { phase: 1, tasks: [{ id: 'T1.1', title: 'Scope', model: 'opus' }] },
          { phase: 2, tasks: [{ id: 'T2.1', title: 'Execute', model: 'sonnet' }] },
          { phase: 3, tasks: [{ id: 'T3.1', title: 'Verify + ship', model: 'sonnet' }] }
        ]
      },
      status: 'roadmap_generated',
      next: body.async ? 'will_call_back' : 'inline_execution_unimplemented_in_scaffold'
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/v1/route') {
    const body = JSON.parse(await readBody(req));
    if (!body.task) return jsonResponse(res, 400, { error: 'Need { task }' });
    // v1.4 scaffold
    jsonResponse(res, 200, {
      task: body.task,
      decision: { model: 'sonnet-4.6', confidence: 0.8, rationale: 'scaffold default' },
      note: 'v1.4 scaffold. Real routing via mcp-server/dist/router.js'
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/v1/sessions/')) {
    const id = req.url.replace('/v1/sessions/', '');
    jsonResponse(res, 200, { session_id: id, status: 'unknown (scaffold)' });
    return;
  }

  jsonResponse(res, 404, { error: 'Not found' });
});

if (!TOKEN) {
  console.warn('[WARN] GOD_MODE_INGRESS_TOKEN not set — server will reject all requests');
}
server.listen(PORT, () => console.log(`God Mode webhook ingress on :${PORT}`));
