# Screenshot kit — what to capture for the launch

You'll need these images for the LinkedIn launch post, the marketplace listing, and the landing page. I can't take screenshots for you, so here's the exact shotlist.

## Required shots (in order of impact)

### Shot 1 — The 6-line exec summary
**Where**: in Claude Code, after running `/god-mode build a Next.js landing page with email signup`.
**What to capture**: the final `✓ DONE / SHIPPED / VERIFIED / COST / TIME / NEXT` block. Make sure at least one task shows `VERIFIED: pass` and ideally one shows `conditional`.
**Why this shot**: this is the single image that communicates the value of the verifier. It's the LinkedIn post hero.
**Crop**: tight crop, just the summary. Add a 2px border in your screenshot tool so the dark text reads on light LinkedIn feeds.

### Shot 2 — The live dashboard
**Where**: open `launch/dashboard.html` in your browser.
**What to capture**: the full page at desktop width (1440px wide). Don't shrink the window.
**Why this shot**: shows roadmap status + model mix + savings + verifier health in one frame. Use this in the landing page hero and the marketplace listing.
**Crop**: full page including the footer line ("v1.3.0 · github.com/themeetpatel/god-mode").

### Shot 3 — The routing eval output
**Where**: run `cd mcp-server && npm run eval:routing` in your terminal.
**What to capture**: the `=== STRATIFIED ACCURACY ===` block through to the `Gates: ... ✓` lines.
**Why this shot**: 100% on 104 cases is the credibility moment for engineers. Pin this in the GitHub README and the AI-builder pack README.
**Crop**: terminal background dark, monospace text crisp.

### Shot 4 — The roadmap rendering
**Where**: in Claude Code, after `/roadmap <a multi-phase goal>` — use example 06 (UAE GTM) for the most dramatic phase count.
**What to capture**: the full roadmap with task IDs, model routing labels, dependencies, estimates.
**Why this shot**: shows the decomposition discipline in action. Use in the LinkedIn variant B ("the technical builder hook").

### Shot 5 — The CEO's intake with memory
**Where**: in Claude Code, after running `node scripts/memory-init.js` and editing `~/.themeetpatel/memory/default.json` to set a stack + voice rules. Then run a relevant goal.
**What to capture**: the CEO's "Using your usual stack: X, Y, Z" intake line — proof that memory works.
**Why this shot**: most agent systems don't have memory. This image makes the difference visible in one frame.

## Optional but useful shots

### Shot 6 — The verifier catching a defect
**Setup**: deliberately comment out one test before running a TDD task. Run the task. Capture the verifier's `VERDICT: fail` with the specific defect named.
**Use**: makes the "shipped is a measurement" claim concrete.

### Shot 7 — Cost-ledger summary
**Where**: run `node scripts/ledger.js` after a few sessions.
**What to capture**: the `--- SAVINGS ---` block showing dollars + percentage.
**Use**: founder/CFO audience — "this is what it actually costs."

### Shot 8 — `install-pack.sh --list`
**Where**: terminal.
**What to capture**: the available-packs list.
**Use**: shows the Domain Packs without people having to read the docs.

## Image specs

| Surface | Dimensions | Notes |
|---|---|---|
| LinkedIn post | 1200×630 (or 1080×1350 for portrait) | Add minimal text overlay; let the screenshot speak |
| GitHub README hero | 1280×640 | Will display at full width on the repo page |
| Marketplace listing | 1024×512 minimum | Check marketplace's specific requirements |
| Landing page hero | 1920×1080 | Used as a backdrop or carousel |
| Twitter/X | 1200×675 | Similar to LinkedIn |

## What NOT to capture

- ❌ Loading states or partial outputs
- ❌ Anything with real customer data, real API keys, or real session IDs that resolve
- ❌ Your shell prompt with your full path (`/Users/<you>/...`) — crop tightly
- ❌ Multiple terminal windows overlapping
- ❌ A messy desktop background

## Suggested colors / theme

The `launch/dashboard.html` uses these colors — use the same for any custom graphics to keep brand consistency:

```
Background:  #0a0a0f   (almost-black)
Panel:       #12131a   (dark panel)
Accent:      #7c5cff   (purple)
Green:       #2dd4a7   (pass)
Amber:       #ffb73d   (conditional)
Red:         #ff5470   (fail)
Text:        #e8eaf0
Muted:       #888b9a
```

## Tooling suggestions

- **CleanShot X** (macOS) — for the terminal/UI shots with quick crop + annotation
- **Carbon (carbon.now.sh)** — for code blocks if you want shareable code snippets
- **Excalidraw** — for the architecture diagram if you want one
- **Figma** — for the LinkedIn carousel slides if you do that variant

## Final check before posting

For every shot:
- ☐ No real PII / API keys visible
- ☐ Dark mode or light mode consistent with surface
- ☐ Crop tight, no whitespace bleed
- ☐ Alt text written (accessibility + SEO)
- ☐ File saved as PNG (not JPG) for sharp text
- ☐ File size < 500KB (compress with ImageOptim or similar)

## When you're done

Drop the screenshots into `launch/images/` and update `launch/README-marketing.md` + `launch/landing.html` to reference them.
