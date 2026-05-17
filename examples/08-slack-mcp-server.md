# Example 08 — Slack MCP server

**Goal:** `Build an MCP server that exposes Slack as 3 tools (send_message, list_channels, search_messages)`

## Expected roadmap

```
GOAL: Production-ready MCP server for Slack with 3 tools, strict schemas, audit, per-client configs, evals.
ASSUMPTIONS: TypeScript + @modelcontextprotocol/sdk; Slack OAuth bot token via env.

Phase 1: Design                        [sequential]
  T1.1  Tool surface design              → Opus   | est: 1500
  T1.2  Input/output schemas             → Sonnet | est: 1000  | needs: T1.1
  T1.3  Security + auth model            → Opus   | est: 800   | needs: T1.1

Phase 2: Implement                     [parallel]
  T2.1  Scaffold + tool: send_message    → Sonnet | est: 1200  | needs: T1.2
  T2.2  Tool: list_channels              → Sonnet | est: 600
  T2.3  Tool: search_messages            → Sonnet | est: 800

Phase 3: Hardening                     [sequential]
  T3.1  Audit log + budget                → Sonnet | est: 800   | needs: T2.*
  T3.2  Eval suite (15+ cases)            → Sonnet | est: 1200  | needs: T2.*

Phase 4: Distribution                  [parallel]
  T4.1  Configs for 4 clients             → Haiku  | est: 400
  T4.2  README + security-model doc       → Sonnet | est: 800

EST. TOTAL OUTPUT TOKENS: ~9100
```

## What gets shipped

A repo following the pattern of `themeetpatel/mcp-server/`:
- 3 tools with strict Zod schemas
- Typed error returns (`{code, message, retryable}`)
- Audit log via `src/audit.ts` pattern
- Per-session tool budgets
- `evals/slack-eval.jsonl` with 15+ stratified cases
- Client configs for Claude Desktop, Cursor, Cline, Windsurf
- Security model doc
- npm scripts: build, dev, inspect, eval

## Verifier checks (via mcp-builder skill)

- All tool inputs use strict schemas (no `any`)
- Output contracts documented per tool
- ≥4 client configs present
- Security model doc covers all categories
- Eval file has ≥10 cases and pass-rate gate
