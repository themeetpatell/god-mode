---
name: codebase-audit
description: Use for CTO-grade repo audits, architecture reviews, technical debt maps, production-readiness checks, and performance/security risk scans.
---

# Codebase Audit

## Workflow
1. Inventory stack, entry points, routes, data stores, integrations, deployment paths.
2. Map business-critical flows.
3. Identify P0/P1/P2 issues across architecture, quality, performance, security, DX, observability.
4. Produce a phased fix plan with tests and owners.

## Output
```
EXECUTIVE VERDICT:
SYSTEM MAP:
P0 RISKS:
P1 RISKS:
P2 CLEANUP:
FIX ROADMAP:
TEST PLAN:
FILES TO TOUCH:
```

## Rules
- Avoid generic best practices. Tie every recommendation to repo evidence.
- Prioritize changes that reduce production risk or unlock velocity.
