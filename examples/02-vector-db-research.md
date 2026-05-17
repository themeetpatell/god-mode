# Example 02 — Vector DB research

**Goal:** `Research the top 5 vector databases for a 10M-doc RAG app and recommend one`

## Expected roadmap

```
GOAL: Source-backed recommendation of one vector DB for a 10M-doc RAG app with <100ms p95 retrieval, predictable cost.
ASSUMPTIONS: Production launch in Q3 2026; 2-person eng team; budget-sensitive; AED-billed.

Phase 1: Scope & question framing      [sequential]
  T1.1  Sharpen the research question      → Haiku  | est: 200
  T1.2  List the 5 candidates              → Haiku  | est: 200   | needs: T1.1

Phase 2: Gather                        [parallel]
  T2.1  Fetch + score Pinecone           → Sonnet | est: 800
  T2.2  Fetch + score Weaviate           → Sonnet | est: 800
  T2.3  Fetch + score Qdrant             → Sonnet | est: 800
  T2.4  Fetch + score Chroma             → Sonnet | est: 800
  T2.5  Fetch + score pgvector           → Sonnet | est: 800

Phase 3: Synthesize                    [sequential]
  T3.1  Landscape map + tradeoffs        → Sonnet | est: 1200   | needs: T2.*
  T3.2  Recommendation + falsifiability  → Opus   | est: 800    | needs: T3.1

EST. TOTAL OUTPUT TOKENS: ~6400
```

## Verified output

A `deep-research` brief shaped exactly per `skills/deep-research/SKILL.md`:
- 5 candidates scored on consistent dimensions
- A/B-tier sources cited per claim
- Recommendation with confidence + reverse-decision cost
- "What would make this wrong" section

## What the verifier checks

- Every cited claim's source actually contains the claim (samples 3)
- Source tier mix ≥ 60% A/B
- "WHAT WOULD MAKE THIS WRONG" section present
- Recommendation is owned (not "it depends" without naming what it depends on)
