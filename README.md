# themeetpatel · God Mode

> **Activate God Mode.** Your AI Product CEO. One goal in, full roadmap out, every task routed to the right brain, deliverable shipped fast and accurately.

A Claude Code plugin **plus** drop-in companions for Cowork, claude.ai Projects, ChatGPT Custom GPTs, Gemini Gems, and Cursor. Same CEO discipline everywhere.

---

## The idea in one paragraph

Most AI work today is one model doing every task — research, decisions, coding, summarizing, formatting — all on the same expensive setting. That's like asking a CEO to type every email. **God Mode** flips it: a CEO orchestrator decomposes your goal into a phased roadmap, routes each task to the right specialist (**Haiku 4.5** for cheap/fast, **Sonnet 4.6** for default, **Opus 4.7** for hard reasoning), runs them in parallel where possible, and synthesizes the deliverable. You get better outcomes at a fraction of the token cost.

---

## What's inside

| File | Purpose |
|---|---|
| `agents/god-mode-ceo.md` | The CEO orchestrator (Opus). Plans, routes, delegates, synthesizes. |
| `agents/haiku-specialist.md` | Fast lane (Haiku). Classify, summarize, format, list, status. |
| `agents/sonnet-engineer.md` | Workhorse (Sonnet). Code, refactor, tests, docs, research, analysis. |
| `agents/opus-architect.md` | Heavy artillery (Opus). Architecture, hard debugging, security, tradeoffs. |
| `agents/synthesizer.md` | Stitcher (Haiku). Merges worker outputs into the final deliverable. |
| `agents/product-strategist.md` | Product strategy, PRDs, roadmap, MVP, monetization. |
| `agents/growth-architect.md` | Demand engines, GTM, funnels, lifecycle, partnerships. |
| `agents/research-analyst.md` | Source-backed research, market maps, competitor analysis. |
| `agents/codebase-auditor.md` | CTO-grade repo audit, tech debt, production readiness. |
| `agents/security-officer.md` | Threat models, auth/data/security reviews. |
| `agents/qa-tester.md` | Test plans, E2E/browser QA, release verdicts. |
| `agents/devops-release-manager.md` | CI/CD, release, rollback, monitoring, cloud readiness. |
| `agents/data-analyst.md` | KPIs, scorecards, dashboards, funnel analysis. |
| `agents/content-strategist.md` | Founder-led content, narratives, editorial systems. |
| `agents/sales-copywriter.md` | Outreach, landing page copy, sequences, objection handling. |
| `agents/ux-conversion-designer.md` | Website IA, UX audits, conversion journeys. |
| `agents/integration-architect.md` | APIs, MCP, webhooks, auth, workflow automation. |
| `agents/prompt-systems-engineer.md` | Skills, prompts, evals, guardrails, token reduction. |
| `agents/chief-of-staff-ops.md` | EOS, SOPs, meeting systems, internal comms, hiring ops. |
| `agents/finance-ops-analyst.md` | Finance ops, pricing, billing, unit economics, controls. |
| `skills/god-mode/SKILL.md` | The activation skill — entry point. |
| `skills/model-router/SKILL.md` | The routing matrix and decision algorithm. |
| `skills/roadmap-builder/SKILL.md` | Decomposition heuristics for any goal shape. |
| `skills/handoff/SKILL.md` | Generate paste-ready briefs to continue God Mode in any other tool. |
| `skills/deep-research/SKILL.md` | Source-backed deep research workflow. |
| `skills/codebase-audit/SKILL.md` | CTO-grade repo audit workflow. |
| `skills/test-driven-development/SKILL.md` | Acceptance criteria → tests → implementation flow. |
| `skills/webapp-testing/SKILL.md` | Browser/UI QA and release validation. |
| `skills/security-review/SKILL.md` | Threat modeling and security review. |
| `skills/root-cause-tracing/SKILL.md` | Incident and bug root-cause investigation. |
| `skills/growth-engine/SKILL.md` | Demand engine and GTM system design. |
| `skills/seo-aeo-geo/SKILL.md` | SEO, AEO, GEO page architecture. |
| `skills/founder-content/SKILL.md` | Founder-led content and anti-generic writing. |
| `skills/internal-comms/SKILL.md` | Internal emails, Slack, policy, warnings. |
| `skills/meeting-insights/SKILL.md` | MoMs, decisions, action items, behavior insights. |
| `skills/data-analysis/SKILL.md` | KPI, spreadsheet, scorecard, and dashboard analysis. |
| `skills/mcp-builder/SKILL.md` | MCP server/tool/prompt/resource design. |
| `skills/git-worktree-release/SKILL.md` | Safe branch/worktree/release flow. |
| `skills/prompt-engineering/SKILL.md` | Prompt systems, guardrails, evals. |
| `skills/skill-creator/SKILL.md` | Create new progressive-loading Claude Skills. |
| `skills/cost-ledger/SKILL.md` | Track token economics and routing waste. |
| `skills/ui-ux-conversion/SKILL.md` | Conversion-first UX and page flow design. |
| `skills/partnerships-outreach/SKILL.md` | Partner, referral, outreach, and headhunting sequences. |
| `commands/god-mode.md` | `/god-mode <goal>` |
| `commands/roadmap.md` | `/roadmap <goal>` — plan only, no execution. |
| `commands/handoff.md` | `/handoff [destination]` — export brief. |
| `commands/status.md` | `/status` — current roadmap state. |
| `hooks/hooks.json` | Optional. Logs routing + prints session summary. |
| `scripts/log-routing.js` | Hook helper — records subagent calls. |
| `scripts/session-summary.js` | Hook helper — prints savings estimate on session end. |
| `portable/universal-system-prompt.md` | **The IP, portable.** Paste into any LLM's instructions. |
| `portable/chatgpt-custom-gpt.md` | Step-by-step to publish a ChatGPT Custom GPT. |
| `portable/cowork.md` | Setup for Anthropic's Cowork. |
| `portable/claude-ai.md` | Setup for claude.ai Projects. |

---

## v1 upgrade: MCP server

This package now includes `mcp-server/`, a portable God Mode operating layer for any MCP-compatible client.

What it adds:

| Layer | Capability |
|---|---|
| Routing engine | `route_task` deterministically picks Haiku/Sonnet/Opus with rationale, confidence, cost ratio, and escalation rule. |
| Session state | `save_session`, `load_session`, `list_sessions`, and `update_task_status` persist roadmaps to `~/.themeetpatel/sessions/`. |
| Roadmap engine | `create_roadmap` turns one messy goal into routed execution tasks. |
| Handoff engine | `create_handoff` generates portable briefs for ChatGPT, Claude, Cursor, Cowork, Gemini, and other clients. |
| Prompt resources | CEO prompt and routing matrix are exposed as MCP resources/prompts. |

Install:

```bash
cd mcp-server
npm install
npm run build
```

Then add `mcp-server/dist/index.js` to your MCP client config. Example configs live in `mcp-server/config/`.


---

## v1.1 upgrade: specialist agents + production skills

This version expands God Mode from a model router into a full operating layer. The design borrows the best patterns from the modern Claude Skills ecosystem: narrow progressive-loading skills, explicit workflows, tool-aware agents, routing discipline, evals, safe installs, and cross-client portability.

New capability clusters:

| Cluster | Agents / Skills | Use it for |
|---|---|---|
| Product & Strategy | product-strategist, growth-architect, ux-conversion-designer | PRDs, GTM, funnels, websites, conversion. |
| Engineering | codebase-auditor, qa-tester, devops-release-manager, integration-architect | repo audits, tests, releases, MCP/API/webhooks. |
| Security & Reliability | security-officer, root-cause-tracing, security-review | auth, permissions, incidents, production risk. |
| Research & Data | research-analyst, data-analyst, deep-research, data-analysis | market research, KPI systems, dashboards. |
| Brand & Revenue | content-strategist, sales-copywriter, founder-content, partnerships-outreach | LinkedIn, emails, WhatsApp, partner campaigns. |
| Ops & Finance | chief-of-staff-ops, finance-ops-analyst | EOS, SOPs, scorecards, billing, controls. |
| Prompt/MCP Systems | prompt-systems-engineer, mcp-builder, skill-creator, prompt-engineering | reusable AI behavior, skills, evals, orchestration. |

Routing principle: the CEO still chooses Haiku/Sonnet/Opus first, then chooses the best specialist. Model = depth/cost. Agent = domain behavior. Skill = repeatable workflow.

---

## Install — Claude Code (full plugin)

### Option A: as a local marketplace

From inside Claude Code:

```
/plugin marketplace add /absolute/path/to/themeetpatel
/plugin install themeetpatel@themeetpatel
```

### Option B: publish to a Git repo

Push this folder to a public GitHub repo, then:

```
/plugin marketplace add https://github.com/<your-user>/themeetpatel
/plugin install themeetpatel@themeetpatel
```

### Verify

```
/plugin list themeetpatel@themeetpatel
```

You should see 20 agents, 23 skills, 4 commands, plus the MCP server.

### Use

```
/god-mode Build a Next.js landing page with email signup, dark theme
```

or in plain chat:

```
Activate God Mode. Goal: Audit my repo for security issues and produce a prioritized fix list.
```

---

## Install — every other tool

### claude.ai (Projects)

→ `portable/claude-ai.md`. 90-second setup. Same CEO discipline, single-model context.

### Cowork

→ `portable/cowork.md`. Paste the universal prompt into your workspace instructions.

### ChatGPT (Custom GPT)

→ `portable/chatgpt-custom-gpt.md`. Full Custom GPT setup with conversation starters. Routing labels become depth cues (no actual Haiku/Sonnet/Opus, but the planning discipline carries over).

### Gemini Gems / Cursor / Windsurf / others

→ `portable/universal-system-prompt.md`. Paste into their equivalent of system prompt / custom instructions / rules.

---

## What makes this different

- **The router is the IP.** Every well-designed AI workflow eventually rediscovers that you should use cheap models for cheap tasks. This plugin makes that the default, with an explicit matrix you can audit and tune.
- **The roadmap is mandatory.** Even small goals get a 2-task roadmap. This forces clarity before tokens are spent.
- **It's portable.** The same CEO behavior runs in Claude Code with real subagents, or in any other LLM with routing-as-style.
- **It composes.** Drop the universal prompt into any existing system prompt; God Mode adds the orchestration layer without replacing your other instructions.
- **The exec summary is non-negotiable.** Every session ends with the same 5-line report: DONE, SHIPPED, COST, TIME, NEXT.

---

## Activation phrases

Any of these trigger God Mode:

- `Activate God Mode. Goal: ...`
- `Engage CEO`
- `God Mode on`
- `/god-mode <goal>`
- Or any multi-step goal: `I want to build...`, `Help me ship...`, `Plan and execute...`

It will **not** activate for trivial single-step asks (translation, definition, one-liners). The CEO has overhead; reserve it for goals that benefit from orchestration.

---

## Token economics (rough)

On a mixed multi-task goal, you can expect:

- ~30% of work routed to **Haiku 4.5** (summaries, formatting, status, listing) → cost ratio ~1×
- ~55% routed to **Sonnet 4.6** (code, docs, research, analysis) → ~5×
- ~15% routed to **Opus 4.7** (architecture, hard debugging, security) → ~15×

Weighted average: roughly **40–60% lower output token cost** vs running everything on Opus, while preserving Opus-level quality on the tasks where it matters.

The hook scripts in `scripts/` log routing decisions per session and print a savings estimate at the end. Use that as ground truth, not the rough numbers above.

---

## Roadmap (yes, this plugin has its own roadmap)

- [x] v0.1 — Core plugin: CEO, three worker specialists, synthesizer, router skill, roadmap builder, four commands, four portable variants
- [x] v1.0 — MCP server packaging so the orchestrator can be called from any MCP-compatible client
- [x] v1.1 — Specialist agent/skill expansion inspired by production Claude Skills and agent-harness systems
- [x] v1.0 — Memory/persistence — resume a roadmap across sessions and tools by hash
- [x] v1.0 — Eval harness — golden goals with expected routing decisions, so the matrix can be tuned without regression
- [ ] v1.2 — Cost ledger with actual API spend where available, richer evals, installer profiles
- [ ] v1.3 — Public marketplace publish, themeetpatel.dev landing page

---

## Contributing

PRs welcome. Especially:

- **New worker specialists** (e.g., a "deep-researcher" that always uses web search)
- **Routing matrix tweaks** with evidence (goals where the current matrix routes wrong)
- **Portable variants** for tools not yet covered (Replit AI, Devin, etc.)
- **Eval cases** for the v0.5 harness

---

## License

MIT.

---

## Credits

Built by Meet Patel (`themeetpatel`). Inspired by the **superpower** plugin pattern of "reusable, shareable AI behavior." Standing on the shoulders of Anthropic's Claude Code plugin spec and the broader ECC / agent-harness community.

> The point isn't to be the greatest AI plugin in history. The point is that the **discipline** the CEO enforces — right model, smallest context, ship the goal — compounds. Use it every day and the rest takes care of itself.
# god-mode
