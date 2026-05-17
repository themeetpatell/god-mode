# Website section update — God Mode v1.3.1

Drop the prompt at the bottom of this file into Claude Code inside your website repo. Everything above the prompt is the spec Claude Code needs to apply.

---

## What changes (and why)

The current section sells v1.0 — CEO + Model Router + Memory. That's still true but it's table stakes now. v1.3.1's three differentiators are:

1. **Verifier** — separate agent that proves work shipped (nobody else has this)
2. **Learning router** — weighted multi-signal scoring, 100% on 104 stratified evals incl 41 adversarial
3. **Context-curator** — minimum viable context per worker (where token savings actually live)

Plus the **Domain Packs** architecture and **portable across every tool** story.

The hero, badges, capability cards, demo terminal, and install panel all need to reflect this.

---

## New copy — element by element

### 1. Eyebrow badge (top, currently "NEW BUILD · AI CHIEF OF STAFF")

**Replace with:**
```
v1.3.1 LAUNCH · OPEN SOURCE
```

### 2. Headline (currently "One goal in. Full roadmap out. Every task routed to the right brain.")

**Replace with:**
```
One goal in. Verified deliverable out.
The AI operating layer for the rest of your work.
```

Keep the gradient color on "Verified deliverable out."

### 3. Sub-headline (currently the "God Mode is my AI execution layer..." paragraph)

**Replace with:**
```
God Mode is an open-source Claude Code plugin + MCP server. One CEO orchestrator decomposes your goal, routes every task to the right model (100% accuracy on 104 stratified router evals), curates minimum context per worker, runs the work in parallel, and a separate verifier agent proves the deliverable shipped. Same discipline runs in Claude Code, claude.ai, Cowork, ChatGPT, Cursor, and Gemini.
```

### 4. Feature badges (currently 4: Phase-aware planning, Cost-tiered routing, Installable handoffs, Session-safe memory)

**Replace with 5 (and update icons accordingly):**
```
✓ Verified deliverables       (was the old "Phase-aware planning")
⚡ 100% router accuracy       (was "Cost-tiered routing")
🧠 Episodic + belief memory   (was "Installable handoffs")
🎒 Domain Packs               (was "Session-safe memory")
🌐 Portable across 6 tools   (new — leads the cross-tool story)
```

If your design system can only fit 4, drop "Episodic + belief memory" and keep the other four.

### 5. Capability cards (currently 3: CEO Orchestrator, Model Router, Execution Memory)

**Replace with 4 cards** (or 6 if your layout supports it). Card content below:

---

**Card 1**

Tag: `STRATEGY → VERIFIED SHIP`
Title: `Verifier`
Body: `The flagship primitive. Every roadmap task runs through a separate verifier agent before "done" reaches you — tests run, sources fetched, voice scored, DAGs walked. "Shipped" stops being a claim and becomes a measurement.`

(Icon: shield-check, or a green checkmark in a circle. The verifier IS the differentiator — make this card visually prominent.)

---

**Card 2**

Tag: `HAIKU · SONNET · OPUS · LEARNED`
Title: `Learning Router`
Body: `Weighted multi-signal pattern scoring with per-pattern weights that sharpen from your own ledger. 100% accuracy on 104 stratified eval cases including 41 adversarial keyword traps. The router is the IP and it compounds with use.`

(Icon: route / network. Keep purple accent.)

---

**Card 3**

Tag: `SMALLEST VIABLE CONTEXT`
Title: `Context Curator`
Body: `Every worker gets only the files, glossary, and decisions it needs — not the whole conversation. Where the cost savings actually live. Names what to drop and why.`

(Icon: filter / funnel. New card.)

---

**Card 4**

Tag: `MEMORY · BELIEFS · EPISODES`
Title: `Persistent Brain`
Body: `Memory facts, belief register with revision history, and vector-indexed episodic recall. Session 10 is better than session 1 because the CEO remembers your stack, ICP, voice, past decisions — and can semantically recall similar past work.`

(Icon: brain / archive. Keep the MCP-NATIVE feel.)

---

(Optional 5th and 6th cards if you have room:)

**Card 5**

Tag: `FOUNDER · UAE · AI-BUILDER · GROWTH`
Title: `Domain Packs`
Body: `Core engine + opinionated packs for your operator role. Founder-UAE, AI-Builder, Growth-Ops ship in v1.3.1 — with more from the community via the marketplace in v1.5.`

(Icon: stack of layered shapes)

---

**Card 6**

Tag: `CLAUDE CODE · CLAUDE.AI · COWORK · CHATGPT · CURSOR · GEMINI`
Title: `Portable`
Body: `Same CEO discipline travels across every tool. Start a goal in Claude Code, continue on your phone in ChatGPT, finish in Cursor. The handoff brief takes the state with you.`

(Icon: globe / share)

---

### 6. Live demo terminal (the `/god-mode Build a launch plan...` block)

**Update the example goal + plan to show the verifier in action:**

```
$ /god-mode Build a Next.js landing page with email signup, ship Vercel-ready

→ INTAKE  (memory: using your Next.js + Tailwind + Supabase defaults)

→ ROADMAP
   Phase 1: Scope & decisions        [parallel]
     T1.1  Framework + design system     → Opus
     T1.2  Hero copy variants (3)        → Haiku

   Phase 2: Build                    [sequential]
     T2.1  Scaffold Next.js + Tailwind   → Sonnet
     T2.2  Hero + FAQ + features         → Sonnet
     T2.3  Email signup + API route      → Sonnet
     T2.4  Playwright tests              → Sonnet

   Phase 3: Polish & ship            [parallel]
     T3.1  SEO meta + JSON-LD            → Haiku
     T3.2  Vercel deploy + smoke test    → Sonnet

→ ROUTE + CURATE CONTEXT  (28% input tokens vs naive)

→ EXECUTE  (8 tasks across 3 model tiers)

→ VERIFY  T1.1 ✓  T1.2 ✓  T2.1 ✓  T2.2 ✓  T2.3 ⚠ (rate-limit missing)
          T2.4 ✓  T3.1 ✓  T3.2 ✓

✓ DONE: Landing page live at example.com
SHIPPED: 8 files, 1 API route, 4 Playwright tests
VERIFIED: 7 pass · 1 conditional · 0 fail
COST: ~$0.41  (Haiku: 2, Sonnet: 5, Opus: 1)  vs all-Opus baseline $1.00
TIME: 18m 42s
NEXT: add rate-limit middleware before public launch
```

Footer line (currently "Routed across 7 specialist agents · 3 model tiers · MCP memory enabled"):

**Replace with:**
```
Routed across 23 specialist agents · Verifier on every task · 100% router accuracy · 59% cheaper vs all-Opus
```

### 7. Install panels (currently 3: Claude Code Plugin, MCP Server Build, MCP Config)

**Keep all 3 panels, but update the commands:**

**Panel 1: CLAUDE CODE · PLUGIN**
```
/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
```

**Panel 2: MCP SERVER · BUILD**
```
cd mcp-server && npm install && npm run build
```

**Panel 3: MCP CONFIG · CLAUDE_DESKTOP_CONFIG.JSON**
```
{
  "mcpServers": {
    "themeetpatel-god-mode": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/themeetpatel/mcp-server/dist/index.js"],
      "env": { "THEMEETPATEL_HOME": "$HOME/.themeetpatel" }
    }
  }
}
```

**Add a NEW 4th panel: PORTABLE · OTHER TOOLS**
```
Paste portable/universal-system-prompt.md into:
• claude.ai → Project custom instructions
• Cowork → workspace instructions
• ChatGPT → Custom GPT instructions
• Cursor → .cursorrules
• Gemini → Gem instructions
```

### 8. Bottom CTAs (currently "View Demo" and "Install God Mode")

**Replace with:**
- Primary (gradient): `Install God Mode →` (links to GitHub repo)
- Secondary: `Read the launch profile →` (links to LAUNCH-PROFILE.md on GitHub)
- Tertiary text link: `100% router eval →` (links to evals/routing-eval.jsonl on GitHub)

### 9. Optional: a new strip BELOW the section showing proof

Below the current section, add a single-row proof strip:

```
[ 23 agents ]  [ 60 skills (28 production, 32 preview) ]  [ 104 eval cases · 100% pass · 41 adversarial · 100% ]  [ MIT licensed · open source forever ]
```

Small text, muted color, subtle border. This is the credibility line.

---

## What stays the same

- Section background and visual styling
- Live demo terminal box layout (just new content inside)
- Install panel layout (just 1 new panel)
- The hero-area placement at top of the section

---

## What gets deleted

- The current 3-card layout (replaced with 4-6 cards as above)
- The old `New Build · AI Chief of Staff` eyebrow badge (replaced)
- The old footer line "Routed across 7 specialist agents · 3 model tiers · MCP memory enabled" (replaced)

---

## CLAUDE CODE PROMPT — paste this into Claude Code in your website repo

```
Update the God Mode section of the landing page to match v1.3.1 capabilities.

Source of truth for the changes: launch/WEBSITE-UPDATE.md in the God Mode repo at /Users/themeetpatel/Downloads/08_Skills_AI_Tools/themeetpatel_god_mode/launch/WEBSITE-UPDATE.md

Do these changes:

1. Find the God Mode section (the one with the headline "One goal in. Full roadmap out.")

2. Replace the eyebrow badge "NEW BUILD · AI CHIEF OF STAFF" with "v1.3.1 LAUNCH · OPEN SOURCE"

3. Replace the headline to: "One goal in. Verified deliverable out." (first line) and "The AI operating layer for the rest of your work." (second line, smaller). Keep the existing gradient color on "Verified deliverable out."

4. Replace the sub-headline paragraph with the v1.3.1 sub-headline from launch/WEBSITE-UPDATE.md.

5. Replace the 4 small pill badges with the 5 (or 4 if layout-constrained) badges listed in launch/WEBSITE-UPDATE.md section 4.

6. Replace the 3 capability cards with 4-6 cards as specified in launch/WEBSITE-UPDATE.md section 5. The cards are: Verifier, Learning Router, Context Curator, Persistent Brain, Domain Packs (optional), Portable (optional). Use the icon suggestions from the spec.

7. Replace the live demo terminal content with the v1.3.1 demo from launch/WEBSITE-UPDATE.md section 6, including the new "VERIFY" line and the updated exec summary with the VERIFIED line. Update the footer line under the terminal.

8. Update the 3 install panels with the v1.3.1 commands. Add a 4th panel for "PORTABLE · OTHER TOOLS" per the spec.

9. Update the bottom CTAs per the spec — primary "Install God Mode →" linking to https://github.com/themeetpatel/god-mode, secondary "Read the launch profile →" linking to https://github.com/themeetpatel/god-mode/blob/main/LAUNCH-PROFILE.md.

10. Add the optional proof strip below the section per the spec.

Constraints:
- Preserve the existing visual styling and color palette (purple/gradient hero, dark background, glass-morphism cards)
- Keep the typography choices
- Don't change navigation or other sections
- If the design system has tokens for these (badge component, card component, CTA button), use them — don't inline new styles
- Mobile responsiveness must be preserved
- After making changes, take a screenshot of the section at desktop width and surface any spots where the new copy length breaks the layout

After applying:
- Run the local dev server and screenshot the section
- Report any text-overflow or wrap issues
- Confirm the GitHub URLs work (https://github.com/themeetpatel/god-mode and the LAUNCH-PROFILE.md link)
- Add a single commit: "site: update God Mode section for v1.3.1"

Verify before committing:
- All 5 (or 4) badges render
- All 4-6 capability cards render without text overflow
- The terminal demo shows the VERIFY line
- All install panels copy correctly to clipboard
- Bottom CTAs link to the right URLs

Push the commit when done.
```

---

## Visual reference — what the new card grid should feel like

```
┌─────────────────────┐ ┌─────────────────────┐
│ STRATEGY→VERIFIED   │ │ HAIKU·SONNET·OPUS   │
│ Verifier            │ │ Learning Router     │
│ Separate agent      │ │ 100% on 104 evals,  │
│ proves work shipped │ │ 41 adversarial.     │
│ — tests run, sources│ │ Gets sharper with   │
│ checked, voice      │ │ every session.      │
│ scored, DAGs walked │ │                     │
└─────────────────────┘ └─────────────────────┘
┌─────────────────────┐ ┌─────────────────────┐
│ MIN VIABLE CONTEXT  │ │ MEMORY·BELIEFS·EP   │
│ Context Curator     │ │ Persistent Brain    │
│ Every worker gets   │ │ Memory + revisable  │
│ only the files +    │ │ beliefs + vector    │
│ glossary it needs.  │ │ episodic recall.    │
│ Where savings live. │ │ Session N > N-1.    │
└─────────────────────┘ └─────────────────────┘
```

If your design only fits 3 cards in a row: Verifier, Learning Router, Context Curator. Move the others to a secondary row.

---

## Why this update matters

The current section sells "we have a CEO orchestrator + a router + memory." That's what every modern agent framework now claims. v1.3.1's actual advantage is **the verifier nobody else has built + the routing accuracy nobody else has measured + the Domain Packs architecture nobody else has shipped.**

If a visitor lands on this page and the section doesn't mention any of those three, the value pitch loses to the noise. The update makes the differentiators the headline.

---

## After applying

- Screenshot the new section at desktop + mobile widths
- Drop the desktop screenshot into the LinkedIn launch post as a supporting image (in addition to the exec-summary screenshot)
- Update the Open Graph image for the page to feature one of the capability cards (Verifier is the best choice)
