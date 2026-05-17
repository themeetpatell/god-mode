---
name: ui-ux-conversion
description: Use for landing page strategy, onboarding flows, website information architecture, UX audits, trust systems, friction removal, and any work where the deliverable is a page or flow that has to convert. Ships with section library, above-the-fold checklist, proof element taxonomy, and conversion mechanics — not generic UX platitudes.
---

# UI / UX Conversion

The job is not "good UX." The job is: the user lands, decides, acts. Everything else is decoration.

## When to use

- Landing page (homepage, product page, pricing page, feature page)
- Onboarding flow (post-signup to first value)
- Conversion audit on existing flow
- IA for a website redesign
- Pricing page specifically (has its own rules)
- Mobile app onboarding
- Form design where completion rate matters

## When NOT to use

- Brand/visual identity work (out of scope)
- Editorial/blog content (use `seo-aeo-geo` + `founder-content`)
- Internal admin UX where conversion isn't the goal

## The protocol

### Phase 1 — User intent + decision moment (always)

```
USER INTENT (one sentence):
  Who: <ICP>
  Where they came from: <referrer / source>
  What they expect: <based on the click that brought them>
  What they're deciding: <next action>
  Why they might hesitate: <top 3 objections>

DESIRED ACTION (one):
  <single CTA: signup / book / buy / subscribe / contact>

TIME BUDGET (theirs):
  <seconds before they bounce>
```

If you can't name the single decision the page enables, the page is going to underperform.

### Phase 2 — The above-the-fold checklist

In the first 300 vertical pixels on desktop / first scroll on mobile, the page must contain:

| Element | Job | Rule |
|---|---|---|
| **Headline** | Promise the outcome | ≤ 10 words, ICP-specific, outcome not feature |
| **Subheadline** | Add the proof / mechanism | ≤ 20 words |
| **Primary CTA** | One action | One button, ICP-specific verb ("Start free trial," not "Get started") |
| **Visual** | Show the product or the outcome | Real product screenshot, not a stock photo |
| **Trust strip** | Lower risk | 4-6 logos or 1 quote or "Used by N teams" |
| **Secondary action** | Catch the un-ready | "See how it works" / "Watch 90s demo" |

If any of these is missing, the page leaks before it gets going.

### Phase 3 — Section library (use these, in this order, skip what doesn't apply)

| # | Section | Purpose | Skip if |
|---|---|---|---|
| 1 | Hero | Promise + action | Never skip |
| 2 | Trust strip | Logos, stats, awards | First-launch product |
| 3 | Problem | Name the pain in user's words | Awareness > intent |
| 4 | Solution | What you do, in one diagram | Never skip |
| 5 | How it works | 3 steps, max | Workflow is one step |
| 6 | Feature triplet | 3 features that map to 3 user benefits | Product is single-feature |
| 7 | Proof: case study | One named customer, one quote, one number | No real customer yet |
| 8 | Proof: comparison | Honest vs alternative | No category leader to compare to |
| 9 | Pricing | Plans + what's in each | Pricing is custom |
| 10 | FAQ | 5-8 real objections | First-time visitor flow |
| 11 | Last-chance CTA | Repeat hero CTA + risk reversal | Never skip |
| 12 | Footer | Standard | Never skip |

Wrong order: pricing before proof. Wrong move: feature dump with no benefit. Wrong tone: founder origin story above the fold.

### Phase 4 — Proof element taxonomy

Pick proof elements by where the user is in their decision:

| Stage | Proof that works |
|---|---|
| Doesn't know you exist | Recognizable logo, press mention, large user count |
| Knows you, weighing options | Specific case study with numbers, named customer quote, comparison table |
| Ready to buy, hesitating | Risk reversal (guarantee, free trial, money back, no credit card), security/compliance badges, testimonial about onboarding experience |
| Post-purchase | Welcome from founder, success milestones, community |

Avoid: stock-photo testimonials, "X% increase in productivity" without source, unnamed quotes.

### Phase 5 — Conversion mechanics

Friction reducers (use as appropriate):
- **No credit card required** — for trials, increases signup by 2-4× typically
- **Single field signup** — email-only, password set later
- **OAuth signup** — Google/Apple, reduces friction massively on mobile
- **Pre-filled forms** — from referrer, UTM, prior session
- **Progress indicators** — for multi-step forms, completion goes up
- **Inline validation** — fix errors as they happen, not on submit
- **Sticky CTA** — for long pages, CTA stays visible
- **Exit-intent capture** — last-chance email or offer

Friction adders to consider (yes, sometimes you want more friction):
- **Qualifying questions** — to filter low-fit signups before they hit sales
- **Calendly with required fields** — to qualify demo requests
- **Pricing transparency** — filters tire-kickers if pricing is high

### Phase 6 — Information architecture (for multi-page sites)

```
SITE MAP:
/                  (Home — primary CTA)
/product           (Product — secondary CTA repeated)
/features          (Feature index)
/features/<f>      (Per-feature pages, SEO + AEO)
/pricing           (Pricing page)
/customers         (Logo grid + case studies)
/customers/<c>     (Individual case studies)
/integrations      (For platform plays)
/blog              (Owned-media, but use /resources or topical /<topic>/ for SEO)
/about             (Brand, team, why)
/contact           (Sales / support)
/login             (Auth)
/signup            (Auth)

CRAWLABILITY:
- /sitemap.xml
- /robots.txt
- /llms.txt (for LLM crawlers — describe site purpose, point to important pages)
```

### Phase 7 — Onboarding (the post-signup mirror of the landing page)

The signup is the conversion event for marketing. The first-value moment is the conversion event for retention. Treat onboarding with the same rigor as a landing page:

| Step | Goal | Friction guard |
|---|---|---|
| Welcome | Set expectation | One sentence, no wall of text |
| Setup | Minimum viable config | Defaults to "good enough," skip optional |
| First value | The thing they signed up for | <5 minutes; everything else can wait |
| Aha moment | Show value > effort | Highlight the outcome, not the feature |
| Habit cue | What to do tomorrow | Email or in-app, not both |

If first value takes >10 min, you've lost the cohort.

### Phase 8 — Tracking

Every page / flow must define:

```
EVENTS (named, captured to analytics):
- <page>_viewed
- <page>_cta_clicked (with cta_name)
- <page>_form_submitted
- <page>_form_error (with field)
- onboarding_step_completed (with step_name)
- aha_moment_reached
- first_value_delivered

FUNNELS:
1. Visit → signup
2. Signup → activation
3. Activation → habit formation

CONVERSION TARGETS:
- Page → primary CTA click: <%>
- CTA click → form submit: <%>
- Form submit → signup: <%>
- Signup → activation (≤24h): <%>
```

Without these, you can't optimize. With them, you can A/B test deliberately.

## The deliverable shape

```
═══ CONVERSION PAGE / FLOW SPEC ═══
Page or Flow: <name>  ICP: <segment>  Goal: <single action>

USER INTENT: <as above>

ABOVE-THE-FOLD:
| Element | Content | Length |
| Headline | <copy> | <wc> |
| Subheadline | <copy> | <wc> |
| Primary CTA | <button label + destination> | n/a |
| Visual | <description> | n/a |
| Trust strip | <content> | n/a |
| Secondary | <copy + destination> | n/a |

SECTIONS (in order):
1. <name> — <purpose, one line>
2. ...

COPY NOTES:
- Voice: <e.g., direct, operator-to-operator>
- Forbidden phrases: <generic verbs to avoid>
- Required proof: <numbers, customers, dates>

CONVERSION MECHANICS:
- Friction reducers used: <list>
- Risk reversal: <statement>
- Secondary action for un-ready: <action>

DESIGN NOTES:
- Mobile-first: <breakpoints>
- Above-the-fold height target: 100vh on hero, 80vh on mobile
- Performance: LCP <2.5s on 4G, no CLS
- Accessibility: WCAG AA, keyboard navigable

TRACKING:
- Events to fire: <list>
- Funnels to monitor: <list>
- A/B test plan: <which element to test first>

FAQ (8 real objections + answers):
Q: <objection in user's words>
A: <answer, no marketing fluff>
...

DESIGN HANDOFF:
- <wireframe link or in-line ASCII>
- <design system reference>
- <icons/illustrations>

DEV NOTES:
- Required components: <list>
- New components to build: <list>
- Backend events / forms: <list>
```

## Anti-patterns

- ❌ Hero headline that describes the company instead of the user benefit
- ❌ "Trusted by the world's leading teams" with no actual logos
- ❌ Stock photos of "happy diverse business team"
- ❌ Feature list above benefit explanation
- ❌ Pricing page with "Contact us" only (kills bottom-of-funnel for SMB)
- ❌ Form with 10 fields when 2 would do
- ❌ CTA verb "Learn more" (every variant outperforms "Learn more")
- ❌ Cookie banner blocking the hero
- ❌ Hero video that autoplays with sound
- ❌ Mobile design that requires 2-finger zoom
- ❌ Sticky elements that cover content
- ❌ "We're not like other X" framing (you're using the comparison's mindshare)

## Copy patterns that work

| Pattern | Example |
|---|---|
| Outcome + time-bound | "Ship your first signed contract in under 7 days" |
| Number + ICP | "How 4,200 UAE accountants closed month-end 3 weeks faster" |
| Specificity over scale | "Cut your post-meeting writeup from 90 min to 5" beats "Save hours" |
| The "before vs after" | "Before God Mode: 14 tabs. After: 1." |
| Anchored guarantee | "If we don't save you 5 hours week 1, we'll cancel and refund" |

## Mobile-specific rules

- Tap targets ≥ 44×44 px
- Form fields trigger correct keyboard (`type=email`, `type=tel`)
- Sticky CTA on long pages
- Hero stacks vertically; no side-by-side content
- Below-fold: max 2 columns
- Hero copy < 12 words

## Routing

- **Haiku**: copy variants, section ordering, FAQ generation
- **Sonnet**: default — full spec, copy + IA + flow
- **Opus**: when the page is the make-or-break of a launch or pricing change

## Verification protocol

The `verifier` (class: content + ops) will:
1. Above-the-fold checklist complete.
2. Sections in correct order.
3. Every section has a stated purpose.
4. FAQ contains ≥ 5 real objections, not marketing fluff.
5. Tracking events defined.
6. Conversion targets specified.
7. Mobile breakpoints noted.

Fail if no single primary action defined or if above-the-fold checklist is incomplete.
