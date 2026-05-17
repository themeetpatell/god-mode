# v1.3.1 — Launch Release

> **God Mode is the AI operating layer that ships verified work, learns from every session, and travels across every tool.** One goal in. Roadmap, model routing, parallel execution, a separate verifier that proves it shipped, and a 6-line exec summary out.

## What this is

A Claude Code plugin (with MCP server) plus portable system prompts for **claude.ai, Cowork, ChatGPT, Cursor, Gemini**. Same CEO discipline everywhere.

## Why it's different from the agent-framework crowd

**1. The verifier.** Every other agent framework lets the worker grade its own homework. God Mode runs a separate verifier agent that proves the deliverable against acceptance criteria — runs the tests, checks the sources, scores the voice, walks the DAG. Per-class verifier scripts shipped: code, content, roadmap, research.

**2. The learning router.** Weighted multi-signal pattern scoring (not `string.includes()` bingo). **100% accuracy on 104 stratified eval cases including 41 adversarial keyword traps.** Patterns: see `mcp-server/src/router.ts`. Eval: `cd mcp-server && npm run eval:routing`.

**3. Context curator.** Computes minimum viable context per worker BEFORE delegation. Where the token savings actually live.

**4. Persistent memory + episodic recall.** Session N is better than session 1 because the CEO remembers your stack, ICP, voice rules, past decisions, beliefs — and can semantically recall past episodes.

**5. Domain Packs architecture.** Core engine + packs for your operator role: `pack-founder-uae`, `pack-ai-builder`, `pack-growth-ops` ship in v1.3.1.

## What's in the box (v1.3.1)

| Layer | Counts |
|---|---|
| Specialist agents | 23 (production) |
| Skills | 60 total — **28 production, 32 preview** (preview clearly tagged) |
| Commands | 4 (`/god-mode`, `/roadmap`, `/handoff`, `/status`) |
| Scripts | 28 production CLIs + 4 per-class verifier scripts |
| Domain Packs | 3 (founder-uae, ai-builder, growth-ops) + 1 org-private template |
| MCP server | Routing, session state, audit log, per-session budgets, prompt resources |
| Eval harness | 104 stratified cases, 41 adversarial, CI-gated |
| Docs | LAUNCH-PROFILE, CHANGELOG, CONTRIBUTING, 11 architecture docs |

**Production vs preview.** v1.3.1 ships everything that genuinely works today. The 32 preview skills (computer-use, cross-vendor routing, voice/vision/screen integrations, etc.) are in the repo with clear `preview: true` markers + visible banners — they teach the v1.4+ roadmap but won't trip up first-time users. See `LAUNCH-PROFILE.md`.

## Install (60 seconds)

### Claude Code (full plugin with real subagents)

```bash
/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
/god-mode <your goal>
```

### claude.ai / Cowork / ChatGPT / Cursor / Gemini

Paste `portable/universal-system-prompt.md` into the tool's instructions field. Same CEO discipline, single-model context.

### MCP server (for Claude Desktop, Cline, Continue, Windsurf, Zed)

```bash
cd mcp-server && npm install && npm run build
```

Then point your client at `mcp-server/dist/index.js`. Example configs in `mcp-server/config/`.

## Try it in 5 minutes

Pick any example from `examples/`:
- `01-landing-page.md` — Build a Next.js landing page with email signup
- `03-security-audit.md` — Audit my repo for security issues
- `05-linkedin-posts.md` — Write 3 LinkedIn posts in my founder voice
- `06-uae-gtm.md` — Plan UAE GTM for B2B finance SaaS (requires pack-founder-uae)
- `10-mvp-scope-cut.md` — Cut my MVP scope to ship in 4 weeks

## The five commandments

1. **Right model for the job.** Opus tokens on Haiku work is malpractice.
2. **Smallest viable context.** Each worker gets the slice it needs, not the whole conversation.
3. **Verify everything.** Worker reports "done" → verifier proves it.
4. **Ship the goal, not the process.** Output is what matters.
5. **Learn from every session.** Ledger → router calibration → sharper routing.

## What's coming in v1.4 (~4-6 weeks)

The preview track (already visible in this repo, with production wiring next):
- Cross-vendor router (Anthropic + OpenAI working)
- Slack bot wired to real CEO loop
- Webhook ingress wired to real CEO loop
- Computer-use loop (Claude Code computer-use MCP)
- Vision-roadmap / voice-intake / code-as-image production

See `LAUNCH-PROFILE.md` for the v1.3.1 → v1.4 → v1.5 → v1.6 sequence.

## Contribute

Especially wanted:
- Adversarial routing-eval cases (keyword traps that fool the router)
- New per-task-class verifier protocols
- Domain Packs for your operator role
- Portable variants for tools we don't cover

See `CONTRIBUTING.md` for the bar.

## License

MIT. Forever.

## Credits

Built by [Meet Patel](https://github.com/themeetpatel). Standing on the shoulders of Anthropic's Claude Code plugin spec, the MCP ecosystem, and every operator who's ever screamed "use the right tool for the job" at a tab full of chatbots.

---

**The point isn't to be the greatest AI plugin in history. The point is that the discipline the CEO enforces — right model, smallest context, verify everything, ship the goal — compounds. Use it every day and the rest takes care of itself.**
