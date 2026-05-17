---
name: cross-vendor-router
description: Routes tasks across vendors (Anthropic, OpenAI, Google, local) on top of the within-Anthropic Haiku/Sonnet/Opus matrix. Picks the cheapest model that meets the quality bar for the task class. Adapter interfaces under scripts/vendor-adapters/ — Anthropic ships real in v1.4; others ship as scaffolds.
preview: true
preview_reason: "Adapter spec + interface shipped. Working OpenAI/Google/Ollama adapters land in v1.4."
---

> ⚠ **PREVIEW** — Anthropic-only routing is production; cross-vendor adapters are scaffold. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Cross-Vendor Router

The within-Anthropic router is the IP. The cross-vendor router is what makes the IP unkillable. When a user can route their work to Claude OR GPT-5 OR Gemini OR a local Llama based on price+quality, the router becomes a commodity-multiplier, not a vendor lock.

## When to use

- User has API keys for multiple vendors and wants "best model for the task regardless of vendor"
- Cost-sensitive deployment where Anthropic isn't the cheapest option per task class
- Multi-vendor enterprise where compliance requires diversification
- Local-first users running Ollama + occasional cloud bursts

## When NOT to use

- Single-vendor user with no preference for cross-vendor (the within-Anthropic router is enough)
- Tasks that require Anthropic-specific features (prompt caching at scale, computer-use in Claude Code)

## The model registry

`~/.themeetpatel/vendor-config.json`:

```json
{
  "vendors": {
    "anthropic": {
      "enabled": true,
      "auth": { "env": "ANTHROPIC_API_KEY" },
      "models": [
        { "id": "claude-haiku-4-5",  "tier": "fast",     "price_in": 0.80,  "price_out": 4.00 },
        { "id": "claude-sonnet-4-6", "tier": "balanced", "price_in": 3.00,  "price_out": 15.00 },
        { "id": "claude-opus-4-6",   "tier": "deep",     "price_in": 15.00, "price_out": 75.00 }
      ]
    },
    "openai": {
      "enabled": false,
      "auth": { "env": "OPENAI_API_KEY" },
      "models": [
        { "id": "gpt-5-mini",  "tier": "fast",     "price_in": 0.50,  "price_out": 2.00 },
        { "id": "gpt-5",       "tier": "balanced", "price_in": 2.50,  "price_out": 10.00 },
        { "id": "gpt-5-pro",   "tier": "deep",     "price_in": 20.00, "price_out": 80.00 }
      ]
    },
    "google": { "enabled": false, "...": "..." },
    "ollama": {
      "enabled": false,
      "auth": { "env": null, "base_url": "http://localhost:11434" },
      "models": [
        { "id": "llama3.3:70b", "tier": "balanced", "price_in": 0,  "price_out": 0 }
      ]
    }
  },
  "quality_floor_by_task_class": {
    "haiku-tier": ["anthropic:claude-haiku-4-5", "openai:gpt-5-mini", "ollama:llama3.3:70b"],
    "sonnet-tier": ["anthropic:claude-sonnet-4-6", "openai:gpt-5"],
    "opus-tier": ["anthropic:claude-opus-4-6", "openai:gpt-5-pro"]
  }
}
```

## Routing flow

```
1. Within-Anthropic router picks tier: haiku-tier / sonnet-tier / opus-tier
2. Cross-vendor router looks up `quality_floor_by_task_class[<tier>]`
3. Filter to enabled vendors
4. Pick cheapest with sufficient pass-rate calibration (≥ 80% historical for this class)
5. If no calibrated model meets the bar, default to Anthropic equivalent
6. Audit log: which vendor was picked and why
```

## Adapter interface

`scripts/vendor-adapters/<vendor>.js`:

```js
module.exports = {
  name: 'openai',
  async call({ model, system, messages, max_tokens, tools }) {
    // returns: { content, stop_reason, usage: { input_tokens, output_tokens, cost_usd } }
  }
};
```

Adapters are interchangeable. The CEO calls a uniform interface; the adapter handles vendor differences.

## v1.4 ships

- Anthropic adapter (full)
- OpenAI adapter (scaffold — needs API testing)
- Ollama adapter (scaffold)
- Google + Cohere + Mistral (interface only)

## Quality floor calibration

For each task class, the calibration script (`calibrated-confidence.js` from v1.4) computes historical pass rates per (vendor, model, task_class). A vendor model is "qualified" for a task class if its pass rate ≥ 80% over ≥ 10 samples.

Initially, only Anthropic models have history. As users opt into other vendors, the calibration data builds, and the router learns when to swap.

## Anti-patterns

- ❌ Routing to local models for tasks where they consistently fail (local quality varies wildly)
- ❌ Ignoring latency (cheapest isn't always best if 10x slower)
- ❌ Routing across vendors mid-roadmap (consistency matters within a session)
- ❌ Routing security-sensitive tasks to local models without explicit user choice
- ❌ Pretending model X = model Y across vendors (they're not interchangeable for hard tasks)

## Verification

The verifier (class: ops) will:
1. Confirm picked vendor has sufficient calibration data OR is the default fallback.
2. Confirm picked vendor's adapter is healthy (auth, network).
3. Confirm cost-vs-quality decision is logged with rationale.

## Routing

- This skill is itself routed by the meta-router (Haiku, since the lookup is mechanical once calibration exists)
