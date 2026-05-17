---
name: vision-roadmap
description: Use when the user uploads a screenshot, wireframe, or design mockup and wants a roadmap to build/clone/match it. Reads the image with Claude's vision capabilities, identifies sections + components + likely tech stack, then produces a Phased roadmap with file-by-file scaffolding plan. Where designers, founders, and PMs actually start.
preview: true
preview_reason: "Requires vision-capable runtime. Works in Claude Sonnet/Opus; scaffold elsewhere."
---

> ⚠ **PREVIEW** — Works in vision-capable runtimes; falls back to "describe the image to me" otherwise. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Vision-First Roadmap

The user pastes a competitor landing page or a Figma export. The system returns a buildable plan. This is the bridge from "I see what I want" to "I have the code."

## When to use

- Competitor landing-page clone (legal usually fine, copying brand obviously not)
- Wireframe → working prototype
- Dashboard mockup → React component scaffolding
- Email template image → MJML / HTML email
- App screen → React Native / SwiftUI / Compose layout
- Marketing asset → on-brand variant

## When NOT to use

- Pure data visualization design (use the data + a chart library directly)
- 3D/animation work (out of scope)
- Pixel-perfect cloning of someone else's branded site (this is theft, not skill)

## The protocol

### Phase 1 — Read the image

```
INPUT: <image path or URL>

EXTRACT:
- Layout: hero, sections (header/feature/CTA/footer), grid structure
- Components: buttons, cards, forms, navs, modals
- Typography: rough font sizes, headlines vs body
- Color palette: 4-6 dominant colors as hex
- Imagery: photos, illustrations, icons
- Inferred tech stack: framework hints (Tailwind utility classes, Next.js style, Material patterns)
- Inferred personality: minimal, dense, playful, serious
```

### Phase 2 — ICP check

Match the image to the user's known stack (from memory):
- "I see Next.js patterns; you use Next.js — good"
- "I see Tailwind utility classes; you use Tailwind — good"
- "I see Material Design; your stack is shadcn — flag the mismatch"

### Phase 3 — Produce the roadmap

Standard God Mode roadmap shape, with file-by-file:

```
GOAL: Build a landing page matching the uploaded design.

Phase 1: Setup [parallel]
  T1.1 Scaffold Next.js + Tailwind + shadcn   → Sonnet | est: 800
  T1.2 Extract palette + typography to tokens → Haiku  | est: 200

Phase 2: Build sections [parallel where possible]
  T2.1 Hero section component                 → Sonnet | est: 1200
  T2.2 Features grid                          → Sonnet | est: 900
  T2.3 Pricing table                          → Sonnet | est: 700
  T2.4 FAQ + footer                           → Sonnet | est: 600

Phase 3: Polish + ship
  T3.1 Mobile + responsive QA                 → Sonnet | est: 700
  T3.2 Accessibility audit                    → Sonnet | est: 500
  T3.3 Deploy + smoke test                    → Sonnet | est: 400
```

### Phase 4 — File-by-file scaffolding

For each component identified, an explicit file plan:

```
FILES TO CREATE:
- app/page.tsx                        (hero, features, pricing, FAQ, footer composed here)
- components/landing/Hero.tsx
- components/landing/FeatureGrid.tsx
- components/landing/PricingTable.tsx
- components/landing/FAQ.tsx
- components/landing/Footer.tsx
- styles/tokens.css                   (extracted palette + typography)
- public/images/hero-screenshot.png   (if relevant)

EACH COMPONENT'S CONTRACT:
Hero.tsx:
  props: { headline, subheadline, primaryCTA, secondaryCTA, image }
  layout: <section> with stacked headline + 2-column on desktop with image right
  responsive: stack on <768px
```

### Phase 5 — Legal + brand check

Output flags:
- "I detected the competitor's brand mark on this image. I will NOT copy it. Suggested swap: <your brand>."
- "This design uses third-party fonts (X). Verify license before using."
- "Image copy text matches a known competitor's marketing — rewrite for your offer."

## Anti-patterns

- ❌ Copy-paste competitor copy verbatim (legal + reputational disaster)
- ❌ Pixel-perfect clone (skip the legal landmines; match the *pattern*, not the asset)
- ❌ Ignoring the user's actual stack (don't suggest Tailwind if they use CSS modules)
- ❌ Inventing components that don't exist in their design system
- ❌ Skipping accessibility / mobile in the roadmap

## Runtime requirement

Requires the Claude API with vision (claude-sonnet-4-6 or claude-opus-4-6). In runtimes without vision (some MCP clients), falls back to "describe the image to me and I'll roadmap from your description."

## Verification

The verifier (class: content + code) will:
1. Confirm no competitor brand marks were copied.
2. Confirm component file plan matches sections in the image.
3. Confirm responsive + a11y are in the roadmap.
4. Confirm tech-stack choice matches user's memory.

## Routing

- **Opus** for the image-to-design extraction (genuinely judgment-heavy)
- **Sonnet** for the per-component scaffolding
- **Haiku** for token + palette extraction
