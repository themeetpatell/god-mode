# God Mode

> **The AI operating layer that ships verified work, learns from every session, and travels across every tool.** One goal in. Roadmap, routing, verification, deliverable out. Open source. Plugin-based.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Router accuracy](https://img.shields.io/badge/router%20eval-100%25%20(64%2F64)-brightgreen)](evals/routing-eval.jsonl) [![Adversarial](https://img.shields.io/badge/adversarial-100%25%20(10%2F10)-brightgreen)](evals/routing-eval.jsonl)

---

## The 30-second pitch

Most AI work today is one model doing every task — research, decisions, coding, summarizing, formatting — all on the same expensive setting. That's like asking a CEO to type every email.

**God Mode flips it.** A CEO orchestrator decomposes your goal into a phased roadmap, routes each task to the right specialist (**Haiku** for cheap, **Sonnet** for default, **Opus** for hard), runs them in parallel where possible, **verifies the work actually shipped**, and hands you a 6-line exec summary.

You get better outcomes at a fraction of the token cost — and you can prove it because every run produces a verifier verdict per task.

## What makes this different

**1. The verifier.** Every other agent framework lets the worker grade its own homework. God Mode runs a separate verifier agent that proves the deliverable against acceptance criteria — runs the tests, checks the sources, scores the voice, walks the DAG. "Shipped" stops being a claim and becomes a measurement.

**2. The learning router.** The router is the IP. It started as keyword bingo; it's now weighted multi-signal pattern scoring with optional learned weight overrides. Run more sessions, the router gets sharper. 100% accuracy on 64 stratified eval cases including 10 adversarial keyword traps.

**3. The handoff brief.** God Mode is portable because the IP is the prompts, not the runtime. Start a goal in Claude Code, continue on your phone in ChatGPT, finish in Cursor. State travels.

**4. Domain Packs.** Core + packs architecture. Install the global engine. Add the pack(s) that match your stack — founder-uae, ai-builder, growth-ops, investor-ops, ceo-rhythms, content-system.

**5. Cost transparency.** Hooks log every routing decision; a session-summary script reports estimated savings vs all-Opus baseline. Real ledger in v1.3 with actual API spend.

---

## Try it in 60 seconds

### Claude Code (full plugin with subagents)

```
/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
/god-mode <your goal>
```

### Cowork / claude.ai / ChatGPT / Cursor / Gemini

→ Paste `portable/universal-system-prompt.md` into the tool's instructions field. Same CEO discipline, single-model context.

---

## What you get

| Layer | What's in it |
|---|---|
| **Core orchestration** | CEO, haiku-specialist, sonnet-engineer, opus-architect, verifier, synthesizer |
| **20 specialist agents** | product, growth, research, codebase, security, QA, devops, data, content, sales, UX, integrations, prompt systems, ops, finance, +pack agents |
| **24 production skills** | god-mode, model-router, roadmap-builder, handoff, **verification (NEW)**, deep-research, codebase-audit, TDD, webapp-testing, security-review, root-cause-tracing, growth-engine, seo-aeo-geo, founder-content, internal-comms, meeting-insights, data-analysis, mcp-builder, git-worktree-release, prompt-engineering, skill-creator, cost-ledger, ui-ux-conversion, partnerships-outreach |
| **4 slash commands** | `/god-mode`, `/roadmap`, `/handoff`, `/status` |
| **MCP server** | Routing engine, session persistence, prompt resources, specialist selection. Works in any MCP-compatible client. |
| **Eval harness** | 64 stratified routing-eval cases, 10 adversarial. `npm run eval:routing` gates PRs. |
| **Hooks** | Optional. Logs every routing decision; prints a session summary with savings estimate. |

---

## The five commandments

1. **Right model for the job.** Opus tokens on Haiku work is malpractice.
2. **Smallest viable context.** Each worker gets the slice it needs, not the whole conversation.
3. **Verify everything.** Worker reports "done" → verifier proves it.
4. **Ship the goal, not the process.** The user wants the deliverable.
5. **Learn from every session.** The ledger feeds the router. The router gets smarter.

---

## Token economics (real numbers, not vibes)

The session-summary hook logs every routing decision and prints estimated savings vs all-Opus baseline. On mixed multi-task goals you can expect:

- ~30% of work routed to **Haiku** (summaries, formatting, status, listing) → cost ratio ~1×
- ~55% routed to **Sonnet** (code, docs, research, analysis) → ~5×
- ~15% routed to **Opus** (architecture, hard debugging, security) → ~15×

Weighted average: **40–60% lower output token cost** vs running everything on Opus, while preserving Opus-level quality on the tasks where it matters.

Run a session, check `~/.themeetpatel/routing.log` for ground truth.

---

## Why you'll keep it installed

- **First run:** the roadmap arrives in seconds and is sharper than what you'd have written yourself.
- **Second run:** you notice the verifier caught a defect a worker would have shipped silently.
- **Tenth run:** the router's pattern weights have learned your task vocabulary; routing accuracy is creeping up.
- **Hundredth run:** the ledger shows how much you've saved and where you're routing poorly. The system has become yours.

---

## Roadmap

- [x] **v1.0** — Core plugin + MCP server packaging + portable variants
- [x] **v1.1** — Specialist agent/skill expansion
- [x] **v1.2** — **Verifier primitive** + **learning router** + 64-case stratified evals + cleanups (this release)
- [ ] **v1.3** — Cost ledger with actual API spend, pack-aware installer, dashboard artifact, memory layer
- [ ] **v1.4** — Cross-device session sync (Supabase backend)
- [ ] **v1.5** — Pack marketplace, themeetpatel.dev landing page

---

## Contribute

We especially want:

- **Adversarial routing-eval cases** — keyword traps that fool the router.
- **Per-task-class verifier protocols** — IaC, data migrations, legal docs, voice-rubric variants.
- **Domain packs** — bring your operator role's opinionated stack.
- **Portable variants** — Replit, Devin, Continue, Zed setups.

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[MIT](LICENSE).

---

## Credits

Built by [Meet Patel](https://github.com/themeetpatel). Standing on the shoulders of Anthropic's Claude Code plugin spec, the MCP ecosystem, and every operator who's ever screamed "use the right tool for the job" at a tab full of chatbots.

> The point isn't to be the greatest AI plugin in history. The point is that the discipline the CEO enforces — right model, smallest context, verify everything, ship the goal — compounds. Use it every day and the rest takes care of itself.
