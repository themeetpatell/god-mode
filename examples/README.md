# Examples

Ten sample goals showing what God Mode does. Run any of these as your first session to see the system in action.

## Goals included

| # | Goal | Best for trying out |
|---|---|---|
| 01 | Build a Next.js landing page with email signup | Full code + ship flow |
| 02 | Research the top 5 vector DBs for a 10M-doc RAG app | Deep-research skill |
| 03 | Audit my repo for security issues and produce a fix list | Codebase-audit + security-review |
| 04 | Refactor my auth module to use OAuth, write tests, ship in branch | TDD + git-worktree-release |
| 05 | Write 3 LinkedIn posts about our launch in my founder voice | Founder-content + voice-rule verifier |
| 06 | Plan our UAE GTM for B2B finance SaaS — 90 days | UAE pack + growth-engine |
| 07 | Design the data model for a multi-tenant CRM | Opus architecture decision |
| 08 | Build an MCP server that exposes Slack as 3 tools | mcp-builder + per-client configs |
| 09 | Read these 4 PDFs and produce a synthesis doc with recommendations | Research synthesis + verifier |
| 10 | Cut my MVP scope to ship in 4 weeks | Strategic decision + roadmap |

## How to run each

In Claude Code with the plugin installed:

```
/god-mode <paste the goal here>
```

In any other tool, paste the universal system prompt first, then:

```
Activate God Mode. Goal: <paste the goal here>
```

## What you'll see

For every goal, the CEO will:
1. Restate the goal in one sentence (folding in memory if relevant)
2. Show a roadmap with model routing per task
3. Curate context for each worker (the context-curator)
4. Spawn subagents in parallel where possible
5. Run the verifier on every task that produced a deliverable
6. Return the final deliverable + 6-line exec summary

Each example below shows the expected roadmap shape so you know what "good" looks like.
