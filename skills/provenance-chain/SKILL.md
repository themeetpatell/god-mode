---
name: provenance-chain
description: Use to track the source of every claim in any deliverable — file, URL, prior decision, user statement, prior episode. Output deliverables get inline provenance tags so anyone can audit the chain from claim → evidence. Critical for research, strategy decisions, regulated content, anything where being asked "where does this come from" is plausible.
---

# Provenance Chain

A claim without a source is a vibe. This skill makes every line in any deliverable traceable.

## When to use

- Research briefs (every fact gets a source tag)
- Strategy decisions (every input gets attribution)
- Regulated content (legal, financial, medical context)
- Any output where the user might be asked "where does this come from" by someone else
- Investor / board / customer deliverables

## When NOT to use

- Creative writing where attribution would interrupt the read
- Code (different provenance model — git blame)
- Internal terse comms where everyone in the loop knows the context

## Provenance tag formats

| Source kind | Format |
|---|---|
| Local file | `[src: path/to/file.md#L34-L40]` |
| URL | `[src: https://example.com/page, accessed 2026-05-17]` |
| Prior episode | `[src: ep-abc, T2.1]` |
| Prior decision | `[src: belief b-042, conf 0.85]` |
| User statement | `[src: user, session-2026-05-17]` |
| Memory fact | `[src: memory.facts.stack.db]` |
| External system | `[src: linear LIN-1234]` |
| Inference (be explicit) | `[inferred from: <source1> + <source2>]` |

## Output style

```
Our typical SMB customer activates within 7 days [src: episodes/ep-abc, T1.3 cohort analysis Apr 2026].
We're seeing a 14% activation lift from the new onboarding [src: data-warehouse, last-30d-cohort-table, accessed 2026-05-17].
Recommend doubling down on activation flow [inferred from: above two facts].
```

Every paragraph in a research brief has at minimum one source tag per factual sentence.

## When sources contradict

Surface it explicitly:

```
Pinecone benchmarks claim p95 <30ms [src: pinecone.io/benchmarks]. Independent benchmarks from Lance Lab measure 60-80ms [src: lancedb.com/blog/benchmark-2025]. Treating 50-80ms as planning range pending our own load test.
```

Don't pick a winner by hiding the disagreement.

## Output contract

The deliverable's normal output PLUS:

```
═══ PROVENANCE SUMMARY ═══
Sources cited: <n>
  - URLs: <n>
  - Files: <n>
  - Prior episodes: <n>
  - Beliefs / memory: <n>
  - User statements: <n>
  - Inferences (no primary source): <n>

CLAIMS WITHOUT SOURCE: <count>  (target: 0)
INFERENCES > SOURCED CLAIMS RATIO: <ratio>  (target: < 0.5)
CONTRADICTIONS SURFACED: <count>
STALE SOURCES (>18mo for fast-moving topic): <count>
```

## Anti-patterns

- ❌ Fake sources ("industry research shows" with no source)
- ❌ Source-bombing (tagging every sentence with the same source 30 times)
- ❌ Hiding inferences as facts (always tag `[inferred]` when you're connecting dots)
- ❌ Citing URLs that don't actually contain the claim
- ❌ Stale citations without recency annotation
- ❌ Picking a side when sources contradict without naming the disagreement

## Verification (this skill's verifier)

The verifier (class: research) will:
1. Sample 3 source-tagged claims and check the source actually supports the claim.
2. Confirm `[inferred]` tag appears wherever a claim combines 2+ sources.
3. Confirm no claim lacks a source tag in a research/strategy deliverable.
4. Confirm contradictions surfaced, not papered over.

Fail if any sampled source doesn't support its claim, or if research outputs have ungrounded claims.
