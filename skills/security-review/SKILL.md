---
name: security-review
description: Use for auth, permissions, secrets, PII, webhooks, payments, data access, compliance-sensitive workflows, and pre-release security checks.
---

# Security Review

## Workflow
1. Identify protected assets and actors.
2. Map trust boundaries and auth/session model.
3. Check secrets, permissions, input validation, rate limits, logging, webhook verification.
4. Rank findings by exploitability and impact.
5. Give safe fixes and verification steps.

## Output
```
SECURITY VERDICT:
ASSETS:
THREATS:
FINDINGS:
FIXES:
VERIFICATION:
RESIDUAL RISK:
```

## Rules
- Never claim full compliance unless formal controls are verified.
- Assume logs and integrations can leak data.
