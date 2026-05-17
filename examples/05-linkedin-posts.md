# Example 05 — LinkedIn posts in founder voice

**Goal:** `Write 3 LinkedIn posts about our launch in my founder voice`

## Expected roadmap

```
GOAL: Three LinkedIn posts about today's launch, in Meet's founder voice, 0 anti-AI-patterns, ≥4 specifics per post.
ASSUMPTIONS: Use memory for voice rules and recent triggers; one post per audience (founder peers, prospects, partners).

Phase 1: Frame                         [sequential]
  T1.1  Pull voice + recent triggers       → Haiku  | est: 300
  T1.2  Pick 3 angles                      → Sonnet | est: 500   | needs: T1.1

Phase 2: Draft (parallel)              [parallel]
  T2.1  Post 1: founder-peer angle         → Sonnet | est: 800   | needs: T1.2
  T2.2  Post 2: prospect angle             → Sonnet | est: 800   | needs: T1.2
  T2.3  Post 3: partner angle              → Sonnet | est: 800   | needs: T1.2

Phase 3: Verify + polish               [parallel]
  T3.1  Run anti-pattern detector          → Haiku  | est: 200
  T3.2  Count lived specifics              → Haiku  | est: 200
  T3.3  Tighten hooks                      → Sonnet | est: 600

EST. TOTAL OUTPUT TOKENS: ~4200
```

## What gets shipped

Three LinkedIn-ready posts, each with:
- Hook in first 2 lines (mobile cut-off line)
- ≥4 concrete proofs (numbers, named people, dates, dollar amounts)
- Zero anti-AI patterns
- A single concrete CTA
- One operator belief per post

## Verifier checks

`scripts/verify/verify-content.js` runs on each:
- Anti-pattern count ≤ 2
- Lived specificity ≥ 4 on pieces > 200 words
- Single operator belief stated

Fail if any post has > 2 anti-patterns or insufficient specifics.
