# Post-launch comments — drop in order after the LinkedIn post

## Comment 1 (immediately after posting, within 60 seconds)

```
🔗 GitHub: https://github.com/themeetpatel/god-mode

Open source. MIT. Install one-liner in the next comment.
```

## Comment 2 (~1 hour after posting)

```
Install (Claude Code):

/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
/god-mode <your goal>

For claude.ai / Cowork / ChatGPT / Cursor / Gemini: paste portable/universal-system-prompt.md into the tool's instructions. Same discipline, single-model context.
```

## Comment 3 (next morning, for the engineering crowd)

```
For the AI builders here — the most interesting file in the repo is mcp-server/src/router.ts.

104 stratified eval cases. 41 adversarial keyword traps ("summarize this architecture decision" type stuff). 100% / 100%.

The whole bet is that routing accuracy compounds — every user's ledger feeds the weights. It's the kind of thing that gets sharper with adoption.

cd mcp-server && npm run eval:routing — try to break it.
```

## Comment 4 (if engagement is strong, day 2)

```
For founders / operators reading this — the killer skill in v1.3.1 is the verifier.

Every roadmap task runs through it before you see the "done" claim. Tests get run for real. Sources get fetched and claims checked. Voice gets scored against an anti-AI-pattern detector. "Shipped" stops being a claim.

Most agent systems let the worker grade its own homework. This one doesn't.

That's the only feature I'd notice missing if I went back.
```

## Comment 5 (responding to specific questions you'll get)

### If someone asks "how is this different from <X agent framework>"

```
Three things <X> doesn't have:

1. The verifier — separate agent that proves the work, doesn't let the worker self-grade
2. The learning router — multi-signal weighted scoring, gets sharper with use
3. The portable layer — same discipline runs in claude.ai, Cowork, ChatGPT, Cursor, not just one client

Plus: Domain Packs for your operator role, persistent memory + episodic recall, 100% router eval accuracy.

Read the LAUNCH-PROFILE.md in the repo — it spells out exactly what's production-ready vs preview so you know what you're installing.
```

### If someone asks about the preview skills

```
v1.3.1 is the launch (everything production-quality). v1.4 ships in ~4-6 weeks and wires the preview scaffolds to real backends — cross-vendor router, Slack bot, computer-use, vision.

The preview files are in the repo deliberately — they show the architecture and what's coming. They're labeled `preview: true` in their frontmatter so the CEO won't invoke them in production workflows.

Full breakdown: LAUNCH-PROFILE.md in the repo.
```

### If someone asks about cost / pricing

```
The plugin is MIT and stays free forever. The router has been benchmarked at ~40-60% cost reduction vs running everything on Opus, on mixed multi-task goals.

If/when a hosted version ships (~v1.6), it'll be open-core — solo $19/mo, team $49/user/mo, enterprise tier with SOC2/SSO. The local plugin will never lose features to drive hosted upgrade.

See surfaces/hosted-saas/SPEC.md for the model.
```

### If someone asks "I want to contribute, where to start"

```
Best place: open a PR with an adversarial routing-eval case.

cd evals && open routing-eval.jsonl
Find a goal type the router gets wrong. Add a case with "adversarial": true.
Run `cd mcp-server && npm run eval:routing` to confirm it actually breaks.
PR the case + the router pattern fix.

That's the highest-leverage contribution because it makes the router sharper for everyone.

See CONTRIBUTING.md for the full bar.
```

### If someone asks about UAE / regional context

```
The UAE-specific stuff is in packs/pack-founder-uae/ — agents for GTM, PRO services, AED finance ops, plus skills for WhatsApp sales scripts and community-led distribution.

Install:
./scripts/install-pack.sh pack-founder-uae

Built from real UAE B2B SaaS experience. If you're in the region and find gaps, PRs welcome — the pack is meant to be opinionated.
```
