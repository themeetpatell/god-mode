# God Mode — 3-minute Loom demo script

> Target: founders, AI builders, ops people. Goal: hook in 10 seconds, demo in 90, payoff in 60. Total 3 minutes max.

## Setup before recording

1. Open Claude Code with the `themeetpatel` plugin installed.
2. Open a clean repo or empty folder.
3. Have these terminals ready in tabs (you may or may not show them):
   - `tail -f ~/.themeetpatel/routing.log` (so the live routing log is visible)
   - The repo's README in a side pane
4. Camera on. Mic check. Sit forward, not back.

## Section 1 — Hook (0:00–0:15)

**Say (camera):**

> "Every AI tool today uses one model for every task — research, decisions, code, summaries — all at the same expensive setting. Watch what happens when you stop doing that."

## Section 2 — The activation (0:15–0:45)

**Show (screen):** Claude Code window.

**Type:**

```
/god-mode Build a Next.js landing page with email signup, dark theme, and ship a Vercel-ready repo
```

**Say (voice-over):**

> "One command. The CEO restates the goal, builds a phased roadmap, and routes every task to the right model — Haiku for the cheap stuff, Sonnet for the workhorse, Opus only when getting it wrong is expensive."

**Show:** the roadmap as it streams in. Pause for ~2 seconds to let the viewer read it.

## Section 3 — The execution (0:45–1:30)

**Say (voice-over):**

> "Now watch the routing in action."

**Show:** the side terminal with `tail -f routing.log` lighting up as each subagent fires. Or, if you don't want to show the log, zoom into the roadmap's `→ Haiku`, `→ Sonnet`, `→ Opus` labels.

**Pull-quote on screen:**

> "30% Haiku · 55% Sonnet · 15% Opus → 40-60% cheaper than all-Opus"

## Section 4 — The verifier moment (1:30–2:15)

**Say (camera, slow down here — this is the differentiator):**

> "Here's what nobody else has built. Every other AI agent framework lets the worker grade its own homework. God Mode runs a separate verifier — it runs the tests, checks the sources, reads the diff, walks the DAG. 'Shipped' stops being a claim. It becomes a measurement."

**Show:** the verifier output for one task. Highlight the `VERDICT: pass` or `VERDICT: conditional pass` line and the `EVIDENCE:` section.

**If you have time, deliberately introduce a defect** (e.g., comment out a test) and show the verifier catching it with `VERDICT: fail`.

## Section 5 — The payoff (2:15–2:50)

**Say (camera):**

> "Final exec summary."

**Show:** the 6-line `✓ DONE / SHIPPED / VERIFIED / COST / TIME / NEXT` block.

**Pull-quote on screen:**

> "100% router accuracy across 64 stratified eval cases. 100% across 10 adversarial keyword traps."

**Say:**

> "And it travels. Start a goal in Claude Code, continue on your phone in ChatGPT, finish in Cursor. Handoff brief takes the state with you."

## Section 6 — The CTA (2:50–3:00)

**Say (camera):**

> "Install in 60 seconds. MIT license. Plugin, MCP server, portable system prompts for every other tool. Link below."

**Show on screen:** GitHub URL + install one-liner.

```
/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
/god-mode <your goal>
```

## End slate

Solid color, 2 seconds:

> **God Mode** · themeetpatel/god-mode · MIT

---

## Notes for the recorder

- **Don't apologize.** No "so basically" or "I built this little thing." Lead with what it does.
- **Don't read the screen.** The viewer can read. You narrate the *why*.
- **Pause after the verifier moment.** That's the line that makes people share the Loom.
- **Cut filler.** Anything that doesn't move the demo forward gets removed in post.
- **Record twice if needed.** The second take is always tighter than the first.
