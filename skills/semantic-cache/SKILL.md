---
name: semantic-cache
description: Use when a goal closely matches a recent past goal — serve the past deliverable from cache instead of re-running. Different from Anthropic prompt-caching (which caches input tokens at the API layer); semantic-cache matches at the goal-intent layer. Saves 30-50% on recurring goals. Scaffold + naive impl in v1.4.
---

# Semantic Cache

If you asked yesterday for "draft a follow-up to my Tuesday demo" and today you ask for "follow-up email after demo Tuesday", the system should ask: "Same as yesterday's, with these updates? Or fresh?"

## When to use

- Recurring goals (weekly standup, monthly KPI review)
- Slight variations of recent goals
- Goals that produce the same artifact shape (templates)
- Multi-user / team contexts where two users might ask similar things

## When NOT to use

- Goals where freshness matters (research with time-sensitive data)
- Creative goals (each should be distinct)
- Anything tagged `no-cache` by the user

## Match algorithm

1. Embed the new goal (uses episodic-memory's embedding)
2. Find top-N past episodes with cosine similarity ≥ 0.75
3. Filter: must have `verifier_verdicts` containing `pass` (don't serve failures from cache)
4. Filter: must be ≤ TTL based on domain
   - Default TTL: 14 days
   - Per-domain overrides in `~/.themeetpatel/cache-ttl.json`
5. If multiple candidates: pick most recent

## TTL by domain

| Domain | Default TTL |
|---|---|
| founder-content | 7 days (voice + triggers shift) |
| growth-strategy | 14 days |
| codebase-audit | 30 days (changes between audits matter; warn but allow) |
| internal-comms | 90 days (templates rarely shift) |
| meeting-insights | per-session (never cache; meetings are unique) |
| research | 30 days (sources go stale) |

## The serve-or-rerun decision

When a match is found:

```
═══ SEMANTIC CACHE HIT ═══
New goal: "<>"
Match: ep-abc (similarity 0.82, 4 days ago)
Original goal: "<>"

OPTIONS:
A. Serve cached output (instant, $0)
B. Serve cached, then diff against fresh re-run (low cost, ~$0.05)
C. Fresh re-run, ignoring cache ($X estimated)
D. Fresh with cached as reference (saves ~30%)

YOUR DEFAULT: D (cache as reference, fresh deliverable)

What would you like?
```

The user picks. Default avoids stale output but captures the savings.

## Anti-patterns

- ❌ Serving cache for anything time-sensitive (news, market data, prices)
- ❌ Serving failed past deliverables
- ❌ Hiding the cache match from the user (they should always know)
- ❌ TTL too long for fast-moving domains
- ❌ Caching content that includes other-user PII (in team contexts)

## Cache invalidation

A cache entry is invalidated when:
- Underlying memory facts have changed (e.g., stack changed after a project's last cache write)
- A relevant belief was revised
- The user explicitly says "don't reuse"

## Verification

The verifier (class: ops) will:
1. Confirm cache hits are surfaced, not silent.
2. Confirm TTL was respected per domain.
3. Confirm failed past episodes weren't served.
4. Confirm user choice was logged.

## Routing

- **Haiku** for the embedding + match (mechanical)
- The downstream "fresh re-run" routing depends on the actual goal
