---
name: codebase-audit
description: Use for CTO-grade repository audits, architecture reviews, technical-debt maps, production-readiness assessments, performance diagnoses, dependency risk scans, and pre-acquisition technical due diligence. Produces a prioritized fix plan with evidence and effort estimates, not a generic best-practices list.
---

# Codebase Audit

A real audit ties every recommendation to a specific file, a specific line, and a specific cost of not fixing it. Generic "you should add tests" is not an audit, it's a fortune cookie.

## When to use

- New repo handover / acquisition diligence
- Pre-scale audit ("we're about to 10× users")
- Post-incident audit ("we keep having outages, find why")
- Pre-investment technical DD
- Quarterly tech-debt review
- Migration scoping ("how hard would it be to extract service X")

## When NOT to use

- A specific bug — that's `root-cause-tracing`
- A specific feature — that's TDD + code
- A security-only review — that's `security-review`

## The protocol

### Phase 1 — Inventory (always)

Run before any opinion is formed. Produce this map:

```
SYSTEM INVENTORY
================
Stack:
  Languages: <list with line counts>
  Frameworks: <list with versions>
  Runtimes: <Node/Python/Go versions>

Entry points:
  HTTP: <routes, count>
  CLI: <commands, count>
  Background jobs: <queues, schedules>
  Webhooks: <endpoints>

Data stores:
  Primary DB: <type, version, size>
  Caches: <list>
  Queues: <list>
  Search/vector: <list>
  Blob storage: <list>

Third-party integrations:
  <list with auth model, criticality, observability>

Deployment:
  Where: <cloud/region>
  How: <CI/CD pipeline, manual steps>
  Environments: <prod/staging/preview>
  Secrets management: <how>

Code metrics:
  Total LoC: <n>
  Test coverage: <% if reported, else "unknown — flag">
  Dependency count: <n direct, n transitive>
  Outdated deps (>1 major): <n>
  Critical CVEs in deps: <n>
```

If any of these are unknown, that itself is a finding (lack of observability).

### Phase 2 — Map business-critical flows

For each flow, walk the code:

- Auth & session
- Money in (checkout / billing)
- Money out (payouts / refunds)
- Data write paths (anything that mutates user state)
- Customer-facing reads (the hot path)
- Admin/back-office (the lowest-tested, highest-risk surface)

Note the files touched per flow and the test coverage on each.

### Phase 3 — Score risks (P0/P1/P2/P3, evidence-tied)

Every finding follows this shape — no exceptions:

```
[P0|P1|P2|P3] <one-line title>
WHERE: <file:line, or directory>
WHAT: <what the code does today>
WHY IT'S A RISK: <concrete failure mode with cost>
LIKELIHOOD: <high / medium / low>
BLAST RADIUS: <users affected, data at risk, recovery time>
FIX: <minimal fix sketch, not a rewrite>
EFFORT: <hours / days>
VERIFICATION: <how we know the fix worked>
```

### Priority definitions

| Tier | Means |
|---|---|
| **P0** | Will cause an incident, data loss, security breach, or revenue loss in the next 30 days at current usage. Stop the room. |
| **P1** | Will cause one of the above as load grows, or every quarter on average. Schedule this sprint. |
| **P2** | Material debt that's slowing velocity or making future P0/P1s more likely. Schedule this quarter. |
| **P3** | Quality of life, cleanup, nice-to-have. Tag for opportunistic work. |

If you have 30 P0s, you're not auditing — you're complaining. Real audits have 1-5 P0s, 5-15 P1s, lots of P2/P3.

### Phase 4 — Bias against rewrites

For every "we should rewrite X," ask:
1. What specifically about X is broken? (If you can't name 3 things, you don't want to rewrite, you want it to be different.)
2. What does the rewrite cost in calendar weeks and risk?
3. What targeted patches give 80% of the value at 20% of the cost?

Recommend patches unless the rewrite is genuinely cheaper than the next 12 months of patching.

### Phase 5 — The deliverable

```
═══ CODEBASE AUDIT ═══
Repo: <name>  Audited: <date>  Auditor: <person/agent>

EXECUTIVE VERDICT (3-5 sentences):
<state of the system, top 2 risks, top 2 strengths>

SYSTEM MAP:
<the inventory from Phase 1, abbreviated>

CRITICAL FLOWS REVIEWED:
- <flow>: <coverage %, observed issues>

FINDINGS:
P0 (n=<>):
  - [P0] <title> (full block per above)
  - ...
P1 (n=<>):
  - ...
P2 (n=<>):
  - ...
P3 (n=<>):
  - ...

DEPENDENCY RISK:
- Outdated >1 major: <count, list top 5 by criticality>
- Known CVEs: <count, list with severity>
- Single maintainer / abandoned: <list>

OBSERVABILITY GAPS:
- <gap> — what we can't see today
- <gap>

TEST COVERAGE GAPS:
- <flow> has <%> coverage — material risk on <area>
- <flow> has no tests at all

FIX ROADMAP (by phase, not by finding):
Phase 1 (this sprint, ~<hours>):
  - <P0 fix>
  - <P0 fix>
  - <highest-leverage P1>
Phase 2 (this quarter, ~<days>):
  - <P1 batch>
Phase 3 (this half):
  - <P2 batch>

FILES TO TOUCH (by priority):
1. <file> — touched by <n> fixes
2. <file> — touched by <n> fixes
...

TEST PLAN:
<test cases that should be added before / alongside fixes>

VELOCITY MULTIPLIERS:
<2-3 changes that would unblock the team systemically — not on the P0 list but worth investing in>
```

## Anti-patterns

- ❌ "Adopt TypeScript" / "Add tests" / "Use Redis" as findings without evidence
- ❌ Findings without file:line references
- ❌ Treating "the code is messy" as a finding (be specific about which mess and why it costs)
- ❌ Recommending a rewrite without naming 3 specific failures of the current code
- ❌ Conflating security findings with architecture findings (route security work to security-review)
- ❌ Generic "improve documentation" — name the doc gap that costs the team time

## Language-specific quick scans

### TypeScript / Node
- `any` usage count
- `--strict` enabled?
- `console.log` in production paths
- `process.env` reads without validation
- Promise rejections not handled
- N+1 queries in ORM use

### Python
- Type hints coverage
- Missing `__init__.py` causing import surprises
- `requirements.txt` vs `pyproject.toml` consistency
- Sync I/O in async paths
- Mutable default arguments

### Go
- Goroutine leaks
- Context propagation
- Error wrapping consistency
- Race conditions in shared state

### Database
- Missing indexes on filtered/joined columns
- Sequential scans on large tables (check EXPLAIN)
- N+1 query patterns
- Migrations without rollback
- Foreign keys missing

### Infrastructure
- Secrets in code / commits
- IAM scope (any `*` policies)
- Public S3 buckets
- Open security groups
- No retention policy on logs

## Worked example finding

Bad:
> P1: Code quality — the codebase has technical debt that should be addressed.

Good:

```
[P1] Auth middleware re-fetches user on every request, no caching
WHERE: src/middleware/auth.ts:34-67
WHAT: middleware calls `db.users.findById(id)` on every authenticated request, including healthcheck spam.
WHY IT'S A RISK: ~14K req/min in production → 14K db reads/min just for auth. We've seen DB CPU spike during traffic bursts. With ~30% projected growth this quarter, this becomes a constant alarm.
LIKELIHOOD: high (already observed in metrics, will worsen with growth)
BLAST RADIUS: all authenticated traffic. Worst case: DB-bound latency cascade to checkout.
FIX: cache the User in Redis with 60s TTL keyed by session ID. Invalidate on logout, password reset, and role change.
EFFORT: 4-6 hours including tests + rollout behind a flag
VERIFICATION:
  - p95 latency on /api/* drops by ≥40% (current: 220ms → target: <130ms)
  - DB read QPS on `users` table drops by ≥90%
  - No cache-staleness regressions in the 7-day rollout window
```

## Routing

- **Haiku**: file/route/dep enumeration (the inventory)
- **Sonnet**: default for finding writeups, fix sketches
- **Opus**: the executive verdict, the rewrite-vs-patch judgment calls, the prioritization

## Verification protocol

The `verifier` (class: code) will:
1. Spot-check 3 P0/P1 findings — open the file:line, confirm the issue exists.
2. Confirm every finding has all 9 required fields.
3. Confirm priority distribution is realistic (not 30 P0s).
4. Run any verification commands listed and capture output.

Fail if findings lack file:line references or if a sampled P0 isn't actually present in the code.

## Time budgets

- Quick audit (single repo, <50K LoC): 30-60 min of Sonnet + 10 min Opus
- Full audit (single repo, <200K LoC): half-day equivalent
- Multi-repo / acquisition DD: scope explicitly — at least a full session per repo
