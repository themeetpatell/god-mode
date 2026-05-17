---
name: mcp-builder
description: Use when designing, implementing, or hardening MCP (Model Context Protocol) servers. Covers tool/resource/prompt design, input schema discipline, security model, per-client config, eval cases, sandboxing, and the recurring failure modes that trip up first-time MCP authors.
---

# MCP Builder

A working MCP server is not a "did npm publish succeed" check — it's "does this expose the right primitives, with the right safety, in a shape every client can consume." This skill builds that.

## When to use

- New MCP server from scratch
- Extending an existing MCP with new tools/resources/prompts
- Pre-publish security review of an MCP
- Cross-client compatibility issues
- Performance / state issues in an MCP

## When NOT to use

- Building an MCP *client* (different concerns)
- Calling MCP from your own code (use the SDK directly)

## The three primitives — when to use which

| Primitive | Use when | Example from this repo |
|---|---|---|
| **Tool** | Action with side effects or computation. Client may call it. | `route_task`, `save_session` |
| **Resource** | Static-ish data the client may read. Like a URL. | `themeetpatel://routing-matrix` |
| **Prompt** | Reusable LLM prompt template the client may instantiate. | `activate_god_mode` |

Most servers over-tool. If the data is read-only and rarely changes, it's a resource, not a tool.

## The protocol

### Phase 1 — Define what this server is FOR

```
SERVER PURPOSE (one sentence):
USERS (who calls this):
TRUST MODEL:
  - Caller trust: trusted / partially trusted / hostile
  - Data sensitivity: public / internal / sensitive / regulated
  - Network: local-only / cloud / mixed
PERSISTENCE:
  - Local state: yes (where) / no
  - External calls: yes (which APIs) / no
```

If you can't fill these, you don't know what you're building yet.

### Phase 2 — Design the tool surface (less is more)

For every tool you're tempted to add, ask:
1. Could this be a resource instead?
2. Could this be combined with another tool (fewer, more powerful tools)?
3. Will the LLM know when to call this vs another tool, or will it guess?

The ideal MCP has 4-12 tools. >20 tools is usually a sign the abstraction is wrong.

### Phase 3 — Input schemas (this is where bad MCPs leak risk)

Every tool input MUST:
- Be a Zod schema (or equivalent strict validator)
- Have explicit min/max on numbers, length on strings, enum on choices
- Reject unknown keys (`.strict()` in Zod)
- Document the unit / format ("ISO-8601", "AED cents", "lower-case slug")
- Not include `any` or unconstrained `string`

```ts
// BAD
inputSchema: { input: z.any() }

// BAD
inputSchema: { id: z.string() }

// GOOD
inputSchema: {
  taskId: z.string().regex(/^T\d+\.\d+$/).describe("Roadmap task id, format T<phase>.<task>"),
  status: z.enum(["pending", "in_progress", "done", "blocked", "cancelled"]),
  outputTokens: z.number().int().min(0).max(50000).optional()
}
```

### Phase 4 — Output contracts

Returns from tools are consumed by an LLM that will try to interpret them. Help it:

- Always return structured JSON inside the `content` text block
- Include the input that produced this output (so the LLM can verify)
- Include a `status` field (`ok`, `partial`, `error`) at the top level
- For long lists, include `count` and `truncated`
- For errors, include `error.code` AND `error.message` AND `error.retryable`

### Phase 5 — Security model (write it down)

Every MCP ships with a `docs/security-model.md` that covers:

```
WHAT IT DOES:
  - <every category of side effect>

WHAT IT DOES NOT DO:
  - <explicit list of non-actions>

PERMISSIONS REQUIRED:
  - Filesystem: <paths it reads/writes>
  - Network: <hosts it calls>
  - Env vars consumed: <list>

APPROVAL GATES:
  - Tools that mutate user data require explicit "confirm" flag
  - Tools that call external APIs require <auth model>

AUDIT LOG:
  - All tool calls logged to <path> with <fields>

FUTURE HARDENING:
  - <known gaps>
```

### Phase 6 — Per-client configs

Ship config snippets for at minimum:
- Claude Desktop
- Cursor
- Cline / Continue
- Windsurf

Each snippet must be copy-paste runnable. Use absolute path placeholders, not vague "your path here."

### Phase 7 — Evals

Every MCP needs:
- A `.jsonl` of tool calls + expected outputs
- A script that runs them and reports pass rate
- A gate in CI (e.g., 90% pass required)

Without evals, behavioral regressions are invisible.

### Phase 8 — Sandboxing

If the server writes files, reads files, or calls external services:
- All paths validated against an allowlist
- All hosts validated against an allowlist
- No `eval` / `Function(...)`
- No shell execution with user input
- Tests for path traversal (`../`, absolute paths, null bytes)
- Tests for SSRF (`http://localhost`, `http://169.254.169.254`)

### Phase 9 — Recovery semantics

When a tool fails:
- Return a typed error, don't throw
- Include `retryable: true|false`
- For partial work, return what was done + what wasn't
- For state-mutating tools, ensure idempotency (same input → same result, no double-write)

## The deliverable shape

```
═══ MCP BUILD BRIEF ═══

SERVER PURPOSE:
USERS:
TRUST MODEL:

TOOLS:
| Name | Purpose | Inputs (key fields) | Outputs | Side effects |
| route_task | ... | task, complexity, stakes | RouteDecision JSON | none |
| save_session | ... | id, title, tasks[] | { saved, path } | writes ~/.themeetpatel/sessions/<id>.json |

RESOURCES:
| URI | Title | MIME | Description |

PROMPTS:
| Name | Args | Output |

INPUT SCHEMAS (zod):
<paste or reference src/schemas.ts>

OUTPUT CONTRACTS:
<one block per tool>

SECURITY MODEL:
<as above>

CLIENT CONFIGS:
- Claude Desktop: <snippet>
- Cursor: <snippet>
- Cline: <snippet>
- Windsurf: <snippet>

EVALS:
- evals/<server>-eval.jsonl with <N> cases
- npm run eval gate: ≥<%>

INSTALL:
$ <install commands>

KNOWN LIMITS:
- <thing>

ROADMAP:
- <future hardening>
```

## Anti-patterns

- ❌ Tool that takes a free-form string and does anything
- ❌ Resource that's actually a tool (changes state on read)
- ❌ Prompt that hardcodes a model name (let the client choose)
- ❌ Mixing read and write in one tool
- ❌ Returning unstructured text from a tool (the LLM has to parse it)
- ❌ Throwing exceptions instead of returning typed errors
- ❌ Reading from `process.cwd()` (will surprise users running across projects)
- ❌ Writing logs to stdout (breaks stdio transport)
- ❌ Hardcoded paths
- ❌ No version on the server (rotating breaks clients silently)

## Self-reference

This plugin's MCP server is your best worked example. Read `mcp-server/src/index.ts` and `mcp-server/src/router.ts` for:
- Zod schemas on every tool
- Resources for static prompt content
- Prompts for activation
- Persistent state in `~/.themeetpatel/sessions/`
- Stratified evals in `mcp-server/src/eval-routing.ts`
- Security model doc in `mcp-server/docs/security-model.md`

If you're stuck on shape, copy from there.

## Routing

- **Haiku**: tool/resource/prompt enumeration tables, config snippet generation
- **Sonnet**: default — design and implementation
- **Opus**: security model design, eval-set design for high-stakes servers

## Verification protocol

The `verifier` (class: integration) will:
1. Confirm every tool input has Zod (or equivalent) with bounded types.
2. Confirm output contract documented per tool.
3. Confirm at least 4 client configs exist (Claude Desktop, Cursor, Cline, Windsurf).
4. Confirm security model doc exists and covers all categories.
5. Confirm an eval file exists and has ≥10 cases.
6. Run the eval CLI and capture pass rate.

Fail if any tool accepts `any`, if security model doc missing, or if evals don't exist.
