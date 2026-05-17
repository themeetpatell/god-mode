# Example 09 — PDF synthesis with recommendations

**Goal:** `Read these 4 PDFs and produce a synthesis doc with recommendations`

(Upload PDFs to the session first.)

## Expected roadmap

```
GOAL: Synthesis doc from 4 PDFs with named conflicts, key claims by tier, and a recommendation supported by the cross-doc evidence.
ASSUMPTIONS: Each PDF is a different perspective; the goal is decision support, not a literature review.

Phase 1: Per-doc extraction            [parallel]
  T1.1  Extract claims from PDF 1        → Haiku  | est: 600
  T1.2  Extract claims from PDF 2        → Haiku  | est: 600
  T1.3  Extract claims from PDF 3        → Haiku  | est: 600
  T1.4  Extract claims from PDF 4        → Haiku  | est: 600

Phase 2: Cross-doc reasoning           [sequential]
  T2.1  Map agreements + conflicts       → Sonnet | est: 1500  | needs: T1.*
  T2.2  Source-tier each claim           → Sonnet | est: 800   | needs: T2.1

Phase 3: Synthesize                    [sequential]
  T3.1  Synthesis brief                  → Opus   | est: 2000  | needs: T2.*
  T3.2  Recommendation + falsifiability  → Opus   | est: 800   | needs: T3.1

EST. TOTAL OUTPUT TOKENS: ~7500
```

## Why Haiku for extraction

Per-PDF extraction is mechanical pattern-matching. The Sonnet/Opus work starts once the claims are normalized and you need to reason across them. This is the routing matrix doing its job.

## What gets shipped

A `deep-research`-style brief that explicitly:
- Names where PDFs agree
- Names where PDFs disagree (and what would resolve)
- Source-tiers each claim
- Recommends a course of action with confidence + reverse-decision cost

## Verifier checks

- Every claim links back to a specific PDF
- Conflicts are named, not glossed
- Recommendation has falsifiability
- Source-tier mix surfaced
