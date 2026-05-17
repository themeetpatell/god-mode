# Example 03 — Security audit

**Goal:** `Audit my repo for security issues and produce a prioritized fix list`

## Expected roadmap

```
GOAL: CTO-grade security audit of <repo>, producing a P0/P1/P2 fix list with evidence, effort, verification.
ASSUMPTIONS: Auth, billing, and admin paths are the highest-stakes surfaces.

Phase 1: Inventory                     [parallel]
  T1.1  Stack + entry points + data stores → Haiku  | est: 600
  T1.2  Map auth flow                       → Sonnet | est: 1000
  T1.3  Map money flow                      → Sonnet | est: 1000

Phase 2: Scan                          [parallel]
  T2.1  Dependency CVE scan                 → Sonnet | est: 600
  T2.2  Secret scan                         → Haiku  | est: 200
  T2.3  Code-pattern smell scan             → Sonnet | est: 1000

Phase 3: Reason                        [sequential]
  T3.1  Threat-model + prioritize           → Opus   | est: 2000   | needs: T1.*, T2.*

Phase 4: Deliver                       [parallel]
  T4.1  Format P0/P1/P2 findings            → Sonnet | est: 2000   | needs: T3.1
  T4.2  Fix-plan roadmap                    → Sonnet | est: 1500   | needs: T3.1

EST. TOTAL OUTPUT TOKENS: ~9900
```

## What gets shipped

A full `codebase-audit` brief with:
- Executive verdict (1 paragraph)
- System map
- Findings ranked P0/P1/P2/P3 — each with file:line, evidence, fix sketch, effort, verification
- Phased fix roadmap

## Verifier checks

- Every finding has file:line
- P0 count is realistic (1-5, not 30)
- Sampled findings actually exist in the code
- Fix-plan groups by phase, not by finding
- "Velocity multipliers" section present

## What you can ask differently

- "Limit to OWASP top 10" — narrows scope
- "Pre-acquisition diligence" — different priority weighting, adds DD-specific axes
- "Audit just src/auth/" — scopes the inventory
