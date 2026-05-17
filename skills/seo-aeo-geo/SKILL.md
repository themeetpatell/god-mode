---
name: seo-aeo-geo
description: Use for SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization, i.e., LLM-answer visibility), topical authority, entity SEO, schema strategy, AEO-ready content blocks, citation farming for LLMs, and conversion-focused content systems. The discipline of being the answer when humans, answer engines, and LLMs are asked.
---

# SEO / AEO / GEO

Three audiences for every page, in this order: humans, answer engines (Google AI Overviews, Perplexity, ChatGPT search), LLM crawlers (training + retrieval). Get them in that order or you optimize yourself out of the funnel.

## When to use

- New site / new content system from zero
- Topical authority play (we want to own this category)
- Content audit (we have 200 posts ranking nowhere)
- Schema / structured data implementation
- AI-answer visibility ("we want to be cited when GPT/Perplexity answers <query>")
- Conversion-from-organic optimization

## When NOT to use

- Single landing page outside an organic funnel (use `ui-ux-conversion`)
- Paid ad copy (use `sales-copywriter`)
- Founder essays (use `founder-content` + chain this skill for the byline page)

## The three games — and they're different

| Game | What it ranks | What it rewards | Where you appear |
|---|---|---|---|
| **SEO** | Pages | Backlinks, relevance, freshness, on-page structure | Blue links in SERPs |
| **AEO** | Specific answer blocks within pages | Direct answer in first 50 words, structured data, FAQ schema, citation-friendly markup | Featured snippets, People Also Ask, AI Overviews |
| **GEO** | Entities, sources, citations | Brand mentions across reputable sources, authoritative single-page answers, structured fact pages | Cited by LLMs (ChatGPT, Claude, Perplexity, Gemini) when users ask |

You play all three. Each requires different page architecture.

## The protocol

### Phase 1 — Topical map (what we want to own)

```
TOPICAL TERRITORY: <category>
ICP SEARCHES (with intent):
  Awareness: <queries>
  Comparison: <queries>
  Decision: <queries>
  Implementation: <queries>

ENTITY GRAPH (the named things in our world):
  Concepts: <list>
  Tools: <list>
  Practices: <list>
  People: <list>
  Companies: <competitors + adjacent>

GAPS WE'LL OWN (where we have unique POV / data):
  - <gap>
  - <gap>
```

### Phase 2 — Page architecture

For every topical territory, three page types:

| Type | Purpose | Length | Structure |
|---|---|---|---|
| **Hub** | Owns the topic, links to everything | 2000-4000 words | Definition + landscape + sub-topics + links out |
| **Pillar** | Definitive answer to a head query | 1500-3000 words | Direct answer + depth + examples + schema |
| **Spoke** | Long-tail / specific intent | 600-1500 words | Tight answer + cross-link to pillar |

Internal linking: hubs → pillars → spokes (and back). Every spoke links up. No orphans.

### Phase 3 — AEO content blocks (the unlock)

Every pillar/spoke page contains these blocks in this order:

```
1. DIRECT ANSWER (first 50 words)
   - Plain English, answers the head query in one sentence
   - Followed by 2-3 supporting sentences
   - Wrapped in <p> with semantic clarity (no fluff intro)

2. KEY FACTS TABLE
   - 4-8 rows of facts in a real <table>
   - Comparable, scannable
   - Easy for answer engines to lift

3. STEP-BY-STEP (when applicable)
   - <ol> with concrete steps
   - Numbered, each step is one action

4. FAQ BLOCK
   - <h3> per question, real <p> answer per question
   - FAQPage schema attached
   - Cover the "People Also Ask" surface

5. COMPARISON / VS
   - Table or list comparing alternatives
   - Honest about tradeoffs (AI loves honest comparison data)

6. CITATIONS / SOURCES
   - Real links to primary sources
   - Date stamps
   - This is what makes GEO work — be a node in the citation graph
```

### Phase 4 — Schema (do it or lose 30% of AEO surface)

Minimum schema per page type:

```jsonld
// Every page
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "<page title>",
  "description": "<meta description>",
  "datePublished": "ISO",
  "dateModified": "ISO",
  "author": { "@type": "Person|Organization", "name": "<...>" }
}

// Hub / pillar
"@type": "Article" or "TechArticle"
+ "headline", "image", "author", "publisher"

// Comparison page
"@type": "ItemList"

// FAQ block on any page
"@type": "FAQPage",
"mainEntity": [
  { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
]

// HowTo
"@type": "HowTo",
"step": [{ "@type": "HowToStep", ... }]

// Product / SaaS
"@type": "SoftwareApplication",
"applicationCategory", "operatingSystem", "offers"

// Author / brand entity (linking to Wikidata if possible)
"@type": "Person" or "Organization",
"sameAs": ["wikipedia URL", "wikidata URL", "linkedin URL", "github URL"]
```

Test with Google's Rich Results Test before shipping.

### Phase 5 — GEO specifics (LLM visibility)

To be cited by LLMs you need:
1. **Brand presence in training data sources** — a Wikipedia entity (or substantial coverage that leads to one), GitHub presence, talks/podcasts, press
2. **Single authoritative pages** that LLM crawlers can lift as quotes
3. **Structured fact pages** ("What is X" / "How does Y work") with citation-friendly attribution
4. **Comparison content** where you appear in an honest comparison
5. **Consistent entity mentions** — the same name, the same canonical site, across the web

GEO is slower than SEO. Plan for 6-12 months before you start showing up in LLM answers.

### Phase 6 — Internal links + topical authority

Topical authority = density of internal linking around a concept. For every territory:
- 1 hub at /<topic>
- 6-12 pillars at /<topic>/<subtopic>
- 20-60 spokes at /<topic>/<subtopic>/<query>
- Every spoke links up to its pillar and across to 2-3 sibling spokes
- Every pillar links up to the hub

Avoid /blog/<title> — flat blog architectures hurt topical authority.

### Phase 7 — Measurement

Track all three games separately:

| Metric | What it tells you |
|---|---|
| **SEO** | Impressions in GSC, clicks, click-through rate, positions for target queries, indexed pages |
| **AEO** | Featured-snippet wins, AI Overview citations, "People Also Ask" presence |
| **GEO** | Citations in LLM answers (manual sampling weekly across ChatGPT/Claude/Perplexity), brand-name searches, direct traffic from "AI users" referrer (often blank) |

Dashboard cadence: weekly for SEO, monthly for AEO/GEO.

### Phase 8 — Conversion path (every page earns its keep)

Every organic page must have:
- An above-the-fold CTA appropriate to intent stage (subscribe / try / book / read more)
- A mid-page CTA (after the meaty content)
- A bottom-page CTA (different from above, like an email-capture)
- A related-pages block (keep them in the territory)

If a page can't define its conversion event, kill it or rewrite it.

## The deliverable shape

```
═══ SEO/AEO/GEO PLAN ═══
Site: <name>  Territory: <topic>  Horizon: <6-12 mo>

TOPICAL TERRITORY:
<as above>

PAGE ARCHITECTURE:
Hub: /<slug> — <H1>
Pillars (target: 8):
  /<slug>/<sub> — head query — target word count
  ...
Spokes (target: 30):
  /<slug>/<sub>/<long-tail> — query — target word count
  ...

INTERNAL LINK MAP:
<graph: who links to whom>

PER-PAGE BLOCKS:
- Direct answer
- Key facts table
- Step-by-step (if applicable)
- FAQ block
- Comparison
- Citations

SCHEMA PER PAGE TYPE:
<table>

GEO MOVES:
- Wikipedia entity: <status> — <plan to earn one>
- GitHub presence: <plan>
- Podcast / talk circuit: <list>
- Press / mentions: <list>
- Comparison pages: <how we appear honestly>

MEASUREMENT:
- GSC dashboard: <link>
- AI-citation sampling cadence: weekly
- KPIs at 30/60/90/180 days: <targets>

EDITORIAL CALENDAR (90 days):
| Week | Page type | Title | Owner | Status |
| 1 | Hub | <H1> | <name> | drafting |
| ... |

CONVERSION PATHS:
- Hub: subscribe to newsletter
- Pillar: free template download → email capture
- Spoke: in-line product CTA + bottom email capture

WHAT WE'RE NOT DOING:
- <gaming tactic> — explicit anti-pattern
```

## Anti-patterns

- ❌ Keyword stuffing (kills SEO and AEO)
- ❌ AI-written content with no human editing or original data (AI Overviews and LLMs increasingly downrank synthetic-looking pages)
- ❌ Generic FAQ blocks that don't answer real People Also Ask queries
- ❌ "Best X tools 2026" listicles with no original analysis
- ❌ Schema lying about page content (Google penalizes)
- ❌ Doorway pages or near-duplicate pages
- ❌ Flat blog architecture
- ❌ Orphan pages (no internal links in or out)
- ❌ Hiding your brand from primary sources because "we're stealth" (kills GEO)
- ❌ Optimizing only for SEO and being invisible in AI answers a year from now

## Quick wins for AEO specifically

- For every existing top-of-funnel page, add a 50-word direct-answer block at the top
- For every comparison page, add a real `<table>` with structured comparison data
- For every product page, add `Product` schema with `offers`
- For every FAQ section, add `FAQPage` schema
- For every "how to" page, add `HowTo` schema
- Audit for "AI snippet readiness" — is the first 50 words answerable in isolation?

## Quick wins for GEO specifically

- Submit the brand entity to Wikidata
- Get on 3-5 podcasts in the category
- Create a "definitive guide to <category>" page that competitors will cite
- Get 1-2 honest comparison pages out where you score yourself fairly
- Open-source one useful thing (LLMs love GitHub content)

## Routing

- **Haiku**: keyword grouping, schema JSON generation, internal-link table
- **Sonnet**: default — full plan, page architecture, editorial calendar
- **Opus**: when the strategy is the only way the company can win (regulated niche, hyper-competitive category)

## Verification protocol

The `verifier` (class: strategy + research) will:
1. Confirm hub/pillar/spoke architecture is concrete (named slugs, not vague).
2. Confirm schema is specified per page type with valid JSON-LD.
3. Confirm internal-linking graph has no orphans.
4. Confirm AEO blocks are listed (direct answer, facts table, FAQ, comparison).
5. Confirm GEO plan includes brand-entity moves, not just on-page SEO.
6. Confirm every page has a conversion event defined.

Conditional pass if AEO blocks are listed but not yet drafted. Fail if no GEO plan in a strategy meant for the 6-12 month horizon.
