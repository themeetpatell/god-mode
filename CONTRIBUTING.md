# Contributing to God Mode

Thanks for wanting to make this better. The plugin's strength is that the discipline (right model, smallest context, verify everything, ship) is general-purpose. Your contributions should sharpen that discipline, not dilute it.

## What we want most

In rough priority order:

1. **Routing-eval cases** — especially adversarial ones (keyword traps that fool the current router). PR them into `evals/routing-eval.jsonl` with `"adversarial": true`. Bonus points if the case actually breaks the current router.
2. **Verifier protocols** — new task classes that need verification (e.g., `infrastructure-as-code`, `data-migration`, `legal-doc`). Add to `agents/verifier.md` and `skills/verification/SKILL.md`.
3. **Domain packs** — bundles of agents+skills+prompts for a specific operator role (e.g., AI-builder, B2B-founder, investor-ops). See "Domain Packs" below.
4. **Portable variants** — God Mode setup for tools we don't cover yet (Replit, Devin, Continue, Zed, etc.).
5. **Router weight tuning evidence** — if you find the router is wrong on a class of goals, open an issue with eval rows that demonstrate it.

## What we don't want

- Skill expansions that don't include examples, anti-patterns, and a verifier protocol. Stub skills are why v1.1 didn't pop.
- New agents that duplicate behavior already covered. The roster is intentionally lean.
- "Add support for X" PRs that only touch the README. Show working code.
- Heavy dependencies in `mcp-server/`. The current dependency footprint is zero runtime deps beyond `@modelcontextprotocol/sdk` and `zod`. Keep it that way.

## Quality bar

Every PR must:

1. Pass `cd mcp-server && npm run eval:routing` (or, if you're modifying the router, add eval cases that justify the change).
2. Include a CHANGELOG entry under "Unreleased."
3. Not break the verifier output contract — downstream parsers depend on the exact shape in `agents/verifier.md`.
4. Stay under ~300 lines per skill file. If you need more, split into a multi-file skill.

## How to add a new skill

1. Create `skills/<your-skill>/SKILL.md` with YAML frontmatter (`name`, `description`).
2. Description should be specific enough that progressive loading triggers correctly (state the trigger, not just the topic).
3. Include: workflow steps, output contract, anti-patterns, routing notes, **at least one worked example**, and a **verification protocol** that the verifier can apply.
4. Add the skill to `mcp-server/src/prompts.ts` `SKILL_REGISTRY`.
5. Add to the README skill table.
6. Add a CHANGELOG entry.

## How to add a new agent

1. Create `agents/<your-agent>.md` with YAML frontmatter (`name`, `description`, `tools`, `model`).
2. Description should make clear when the CEO routes here vs. another agent (not just "general purpose").
3. Include an output contract ending with `STATUS: done | partial | needs-info` (or class-specific equivalents).
4. Add to `mcp-server/src/prompts.ts` `SPECIALIST_REGISTRY` and `recommendSpecialist` rules.
5. Add to the README agent table.
6. Add a CHANGELOG entry.

## Domain Packs

A Domain Pack is a curated bundle of agents+skills+prompts for a specific operator role. Examples being designed:

- `pack-founder-uae` — UAE/GCC GTM, NRI segment, business-setup PRO services, AED billing
- `pack-ai-builder` — Claude/OpenAI/MCP integration patterns, eval design, agent harnesses
- `pack-growth-ops` — funnel diagnostics, lifecycle, attribution, channel benchmarks
- `pack-investor-ops` — diligence checklists, memo writing, portfolio scorecards
- `pack-ceo-rhythms` — EOS/V/TO/L10s, scorecards, executive comms
- `pack-content-system` — founder voice, editorial calendars, anti-AI-pattern detector

Packs live under `packs/<pack-name>/` and follow the same `agents/` + `skills/` + (optional) `commands/` structure. They install on top of `core/`. See `packs/README.md` for the pack spec.

## Router changes — the bar is high

The router is the IP. Changes must:

1. Add or modify eval cases that demonstrate the change is right.
2. Pass `npm run eval:routing` with the new cases included.
3. Not regress any existing case unless you explicitly change the expected value with reasoning in the PR description.
4. Be tunable via `~/.themeetpatel/router-weights.json` if the change is a weight adjustment (no need to recompile in that case).

## PR process

1. Branch off `main`.
2. Make your change.
3. Run `npm run eval:routing` and paste the output into the PR.
4. Update CHANGELOG.md.
5. Open PR with a one-line summary + a "why" paragraph.

## Code of conduct

Be direct. Be specific. Don't be precious about your code. If a maintainer rejects a PR with a one-line "no, here's why," that's a feature not a bug — that's the same discipline God Mode itself enforces. Ship the goal, not the ego.
