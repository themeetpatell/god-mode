# 100x God Mode Operating System

## Default loop

1. Capture goal.
2. Convert into success criteria.
3. Route every task.
4. Execute only the next unblocked task.
5. Save state after every meaningful output.
6. Create handoff when changing tools.

## Power features to add next

| Upgrade | Why it matters | Build path |
|---|---|---|
| Cost ledger | Shows actual savings, not vibes | Log every route/task/output token estimate into SQLite/JSONL |
| Eval harness | Prevents routing drift | Run `evals/routing-eval.jsonl` against router before releases |
| MCP mediator | God Mode can call other MCP servers | Add downstream MCP client registry + approved tool budget |
| Repo memory | Avoids rereading whole codebases | Cache file map, glossary, architecture notes per repo |
| Approval gates | Safer for production actions | Require explicit approval for write/delete/deploy commands |
| Outcome score | Measures quality of shipped work | Score every session against success criteria |

## Non-negotiable standards

- No full-history dumping into workers.
- No Opus for mechanical work.
- No Haiku for decisions with consequences.
- Every session should end with: shipped, risks, next action, saved state.
