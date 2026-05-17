# Domain Packs

> **Core + Packs architecture (v1.2+).** The plugin ships with a thin core (CEO, router, roadmap, verifier, synthesizer, handoff) and an expanding set of domain packs that bundle agents+skills+prompts for a specific operator role.

## Why packs

A founder shipping a UAE-focused B2B SaaS does not need the same agents as an AI-builder shipping MCP servers, who does not need the same agents as an investor running portfolio diligence. v1.1 jammed all three into one flat skill folder. Packs let users install only what matches their stack.

## Pack spec

A Domain Pack lives under `packs/<pack-name>/` and follows this layout:

```
packs/<pack-name>/
  pack.json              ← metadata + dependencies on core/other packs
  README.md              ← what the pack does, ICP, install
  agents/                ← pack-specific agents
  skills/                ← pack-specific skills
  commands/              ← optional pack-specific slash commands
  prompts/               ← optional reusable prompts
  memory/                ← optional seed memory files
```

`pack.json` shape:

```json
{
  "name": "pack-founder-uae",
  "version": "0.1.0",
  "description": "...",
  "dependsOn": ["core"],
  "icp": "B2B founder targeting UAE/GCC SMB",
  "agents": ["./agents"],
  "skills": ["./skills"],
  "commands": ["./commands"]
}
```

## Installation model

Once split, packs install independently:

```
/plugin install themeetpatel-core@themeetpatel
/plugin install themeetpatel-founder-uae@themeetpatel
/plugin install themeetpatel-ai-builder@themeetpatel
```

The CEO is pack-aware — it loads the agent/skill registries from every installed pack on startup and routes accordingly.

## Initial pack roadmap

| Pack | Stage | What's inside (target v1.0) |
|---|---|---|
| `core` | shipping (this repo, root) | god-mode-ceo, router, roadmap, verifier, synthesizer, handoff, model-router, verification, prompt-engineering, skill-creator |
| `pack-founder-uae` | stub (this folder) | UAE/GCC GTM, NRI segments, business setup (free zone vs mainland), AED billing/VAT, community channels, WhatsApp scripts |
| `pack-ai-builder` | stub (this folder) | MCP server design, Claude API patterns, agent harnesses, eval design, prompt-debugging, skill-creator++ |
| `pack-growth-ops` | stub (this folder) | funnel diagnostics, lifecycle automation, attribution, channel-benchmark library, SEO/AEO/GEO |
| `pack-investor-ops` | not started | diligence checklists, memo templates, portfolio scorecards, founder-update parser |
| `pack-ceo-rhythms` | not started | EOS V/TO + Rocks, L10 agendas, scorecard library, executive comms |
| `pack-content-system` | not started | founder voice, editorial calendars, anti-AI-pattern detector, repurposing engine |

## Migration plan from v1.1 flat → v1.2 packs

The v1.2 release keeps the flat layout for backward compatibility. The packs/ folder ships alongside as the "preferred new home" with stubs that reference the existing flat files.

In v1.3 the flat duplicates are removed and consumers install via the pack manifests. Backward-compat shim: the root `agents/` and `skills/` folders become symlinks to `packs/core/`.

## Pack authoring rules

1. Every pack must have a clear ICP — one sentence: "who is this for."
2. Every pack must list `dependsOn` explicitly — at minimum `["core"]`.
3. Pack-local skills and agents may reference each other but **must not reference another pack**. Cross-pack references go through the core registry.
4. Every pack ships at least one **worked example** in `examples/<pack-name>/` so first-run users see the pack in action.
5. Every pack has its own routing-eval cases in `evals/<pack-name>.jsonl` so router accuracy can be measured per pack.
