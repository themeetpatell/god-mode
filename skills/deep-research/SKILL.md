---
name: deep-research
description: Use for citation-backed market research, competitor landscapes, vendor comparisons, regulatory/technical research, fresh-information synthesis, and any task where being wrong on a fact has real cost. Produces operator-ready briefs with explicit source quality, fact/inference/opinion separation, and a falsifiability section.
---

# Deep Research

The default research skill in God Mode. The bar is "an analyst at a top consulting firm would sign their name to this." Vibes don't ship.

## When to use

- Market sizing, competitor maps, vendor comparisons
- Regulatory or compliance research (UAE/GCC, EU AI Act, GDPR, HIPAA, SOC2)
- Pricing/spec/feature research where the data lives behind a search engine
- Pre-investment diligence on a tool, company, or trend
- Decision support: the user is about to make a call and needs evidence

## When NOT to use

- "What's the capital of France" — go direct, no skill
- Internal knowledge synthesis from already-provided files — use `meeting-insights` or general analysis
- Speculative futurism — flag and reframe as a decision question, then return

## The protocol

### Phase 1 — Frame the question (always)

Before any web call, write:

```
DECISION SUPPORTED: <one sentence — what call does this research enable>
RESEARCH QUESTION: <restated, sharper than the user's wording>
SOURCE TYPES THAT WOULD COUNT: <primary, peer-reviewed, vendor-disclosed, regulator-published, journalistic, social>
DISQUALIFIERS: <date floor, geographic floor, language constraints>
TIME BUDGET: <minutes>
```

If the decision is unclear, ask once. If the user can't name a decision, this isn't deep research — it's curiosity, and that's fine, but route to lighter handling.

### Phase 2 — Source the answer (recency-first)

Search order:
1. **Regulator/standards body** (if applicable): the official site is the truth.
2. **Vendor-disclosed**: ToS, pricing pages, status pages, security pages, docs.
3. **Primary journalism** (FT, Reuters, Bloomberg, specialized trade press) for events.
4. **Peer-reviewed** for technical/scientific claims.
5. **Industry research firms** (Gartner, Forrester, IDC) for market data, with skepticism about methodology.
6. **Founder/exec long-form** (Stratechery, vendor blogs, conference talks) for thesis.
7. **Aggregators** (Wikipedia, comparison sites) for breadth, never for the final claim.

Recency rules:
- Fast-moving tech (AI, LLMs, cloud): floor is 12 months for prices/specs, 6 months for landscape claims.
- Slower domains (regulation, fundamentals): 24-36 months acceptable.
- Always check the publication date AND the "last updated" date — they often differ.

### Phase 3 — Separate claim types (this is the whole game)

For every line in the brief, tag it implicitly:

- **Fact**: directly observable in source. Quoted or paraphrased with reference.
- **Inference**: combining 2+ facts. Show your work.
- **Opinion**: someone's argument. Name the someone.
- **Uncertainty**: known unknowns. Don't paper over them.

If you can't tag a claim, you don't have it yet. Get the source or remove the claim.

### Phase 4 — Score source quality

| Tier | What | Example |
|---|---|---|
| **A** | Primary, neutral, current | SEC 10-K, regulator notice, official pricing page |
| **B** | Secondary, reputable, current | Top-tier journalism, peer-reviewed paper |
| **C** | Secondary, partisan or commercial | Vendor whitepaper, sponsored research |
| **D** | Tertiary, opinion, aggregated | Personal blog, Reddit thread, social media |
| **F** | Unverifiable, anonymous, content-farmed | Listicles, AI-generated SEO sludge |

Brief should be A/B with C only when explicitly framed. D for color only. Never F.

### Phase 5 — Synthesize

Produce the brief in this exact shape:

```
═══ DEEP RESEARCH BRIEF ═══

DECISION SUPPORTED:
<one sentence>

RESEARCH QUESTION:
<one sentence>

TOP FINDINGS:
1. <finding> [A-tier: <source>, <date>]
2. <finding> [B-tier: <source>, <date>]
3. <finding> [A-tier: <source>, <date>]
   ↳ Inference from #1 + #2: <derived claim>

LANDSCAPE / MAP:
<table or list with options scored on the criteria the decision needs>

CONFLICTING SIGNALS:
- <where sources disagree, and what would resolve it>

KEY UNCERTAINTIES:
- <what would change the answer>
- <what data would close the uncertainty>

WHAT WOULD MAKE THIS WRONG:
- <falsifiability test — the brief is wrong if X is observed>

RECOMMENDATION (if asked):
<one paragraph, owned: "I recommend X because Y. Confidence: medium. Reverse-decision cost: ~$N">

SOURCE MAP:
A-tier: <count, with URLs>
B-tier: <count, with URLs>
C-tier: <count, with URLs>

NEXT MOVES:
- <what to research next if the decision needs more confidence>
```

## Anti-patterns

- ❌ Citing "industry reports show" without the report
- ❌ Quoting numbers without a date and source
- ❌ Mixing claim types in one bullet ("the market is $X and growing because Y is the future")
- ❌ Hedging every claim equally — distinguish "fact, A-tier" from "founder opinion, C-tier"
- ❌ Recommending without saying what would make the recommendation wrong
- ❌ Synthesizing across sources that contradict without naming the disagreement

## Worked example

Question from user: *"Which vector DB should I use for a 10M-doc RAG app?"*

Bad version (what most agents produce):
> "Pinecone is great for production. Weaviate is open source. Chroma is good for prototyping. Qdrant is fast."

Good version (this skill):

```
DECISION SUPPORTED:
Pick a primary vector DB for a 10M-document production RAG app launching in Q3 2026.

RESEARCH QUESTION:
At 10M docs (≈ 30M chunks at typical chunking), which vector DBs deliver <100ms p95 retrieval, predictable cost, and operational simplicity for a 2-person team?

TOP FINDINGS:
1. Pinecone serverless prices at $0.33/million reads and $4.00/million writes (May 2025). At 30M chunks indexed once + 1M reads/day → ~$130/mo storage + $10/mo reads. [A-tier: pinecone.io/pricing, May 2025]
2. Weaviate Cloud at the same scale: starter tier capped at 1M objects; Standard tier starts at $295/mo for ≤25M. [A-tier: weaviate.io/pricing, Apr 2025]
3. Qdrant Cloud: ~$60/mo for 4 vCPU 8GB which handles 10M docs at <50ms p95 per their benchmarks. [C-tier vendor benchmark: qdrant.tech/benchmarks, Mar 2025]
   ↳ Inference: Qdrant lowest TCO but ops burden on you if self-hosted.

LANDSCAPE MAP:
| DB | Ops effort | Cost @ 10M docs | p95 latency | Schema flex | Best fit |
|---|---|---|---|---|---|
| Pinecone | low | medium | <50ms | medium | small teams, fast launch |
| Weaviate | low (cloud) | high | <80ms | high | complex schemas, hybrid search |
| Qdrant | medium | low | <50ms | medium | cost-sensitive, ops-comfortable |
| Chroma | low | n/a (no managed) | varies | low | prototyping only |

CONFLICTING SIGNALS:
- Pinecone benchmarks (vendor) claim <30ms; independent benchmarks (Lance, 2024) measure 60-80ms. Use 50-80ms for planning.

KEY UNCERTAINTIES:
- Pinecone serverless pricing has changed twice in 12 months. Lock-in risk if it changes again.
- Qdrant performance under sustained 100 QPS write isn't documented publicly. Test before committing.

WHAT WOULD MAKE THIS WRONG:
- If your team has Postgres in production already, pgvector + pgvectorscale matches all three on cost and removes one system. Reconsider.

RECOMMENDATION:
Start with Pinecone serverless for the 6-week launch window. Migrate to Qdrant self-hosted in month 6 if read volume grows past 5M/day. Confidence: medium. Reverse-decision cost: ~2 engineer-weeks of re-indexing.
```

That's the difference.

## Routing

- **Haiku**: source extraction, table cleanup, formatting the brief shell
- **Sonnet**: default. The bulk of the research and synthesis
- **Opus**: strategic conclusions, regulatory-sensitive calls, multi-source contradictions, high-stakes investment decisions

## Verification protocol

The `verifier` (class: research) will:
1. Sample 3 cited claims and WebFetch the sources.
2. Confirm each source supports the claim.
3. Score source tier mix (target: ≥60% A/B).
4. Flag any claim with no source.
5. Check the brief has a "WHAT WOULD MAKE THIS WRONG" section.

Conditional pass if mix slides to C-heavy. Fail if any A-tier claim's source doesn't actually contain the claim.

## Cost discipline

Don't run 50 web searches on a Sonnet task that needs 5. The brief is better when fewer, higher-quality sources are read fully than when many are skimmed. Aim for 5-12 source fetches per brief.
