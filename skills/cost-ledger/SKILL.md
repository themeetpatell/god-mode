---
name: cost-ledger
description: Use for token/cost tracking, routing economics, session summaries, savings estimates, and model usage analytics.
---

# Cost Ledger

## Workflow
1. Capture task id, route, model, estimated tokens, actual output size, status.
2. Compare routed cost units against all-Opus baseline.
3. Surface waste: over-routing, repeated context, failed tasks, rework.
4. Recommend routing matrix improvements.

## Output
```
SESSION:
TASK COSTS:
SAVINGS:
WASTE FOUND:
ROUTING TUNING:
NEXT ACTIONS:
```

## Rules
- Estimate honestly when exact API usage is unavailable.
- Treat rework as real cost.
