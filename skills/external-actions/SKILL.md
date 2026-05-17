---
name: external-actions
description: Use to execute approved writes to external systems — send email, post to Slack, create CRM record, update Linear issue, commit + push code, file an expense, etc. EVERY external write goes through this skill's approval gate. Connectors are registered in ~/.themeetpatel/connectors/. Scaffold in v1.4 — real connectors land as the user wires their API keys.
preview: true
preview_reason: "Framework + approval-gate logic shipped. Per-connector adapters (Slack/Gmail/Notion/Linear/GitHub/etc) land in v1.4-v1.5."
---

> ⚠ **PREVIEW** — Approval-gate framework is real; per-connector adapters are scaffold. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# External Actions

The framework for any write to an outside system. Approval gates are the whole point — this skill exists so the LLM never silently sends an email or pushes to main.

## Connector registry

`~/.themeetpatel/connectors/<name>.json`:

```json
{
  "name": "slack-finanshels",
  "type": "slack",
  "auth": { "method": "env", "env_var": "SLACK_BOT_TOKEN" },
  "scopes_allowed": ["chat:write", "channels:read"],
  "channels_allowed": ["#internal-leadership", "#standup"],
  "destructive_actions": [],
  "rate_limit": { "per_min": 10, "per_day": 200 }
}
```

The connector declares what's allowed. The runtime enforces.

## Approval policy

Every action gets classified:

| Class | Examples | Approval |
|---|---|---|
| **Read** | List channels, search, read user info | Auto |
| **Internal write** | Post in pre-approved channel, update internal doc | Per-session approval |
| **External write** | Send DM to non-team member, send email | Per-action approval |
| **Mutating** | Delete record, archive channel, close PR | Per-action with confirmation phrase |
| **Money / irreversible** | Send payment, deploy to prod, sign contract | Refused (route to human) |

## The action flow

```
1. CEO or specialist agent decides "I want to do X"
2. External-actions skill receives a structured request:
   { connector: "slack-finanshels", action: "post_message", args: { channel: "#standup", text: "..." } }
3. Skill checks: is this action class allowed by the connector? Is the channel in the allowlist?
4. If approval needed: present to user with full payload, wait
5. On approval: execute via connector adapter
6. Log to ~/.themeetpatel/external-actions.jsonl
7. Return result to caller
```

## Built-in connector adapters (v1.4)

| Connector | Status | Auth |
|---|---|---|
| `slack` | scaffold | bot token |
| `gmail` | scaffold | OAuth |
| `notion` | scaffold | integration token |
| `linear` | scaffold | API key |
| `github` | scaffold | gh CLI / PAT |
| `calendar` | scaffold | OAuth |
| `whatsapp` | scaffold (WATI/Trengo) | API key |
| `vercel` | scaffold | API token |
| `stripe` | scaffold (READ ONLY by default) | secret key |

Each scaffold ships a tiny adapter in `scripts/connectors/<name>.js` that takes `(action, args, auth)` and returns a typed result. v1.4 ships the framework + 3 example adapters fully wired; the rest land in v1.5 as users contribute.

## Output contract

```
═══ EXTERNAL ACTION ═══
Connector: <name>
Action: <action>
Args (redacted): <summary, no PII>

CLASSIFIED AS: <read | internal-write | external-write | mutating | money>
APPROVAL: auto | approved-by-user at <ts> | refused

EXECUTED: yes | no (refused: <reason>)
RESULT: <connector-specific>
ROLLBACK: <how to undo, if applicable>
LOGGED TO: ~/.themeetpatel/external-actions.jsonl
```

## Anti-patterns

- ❌ Bypassing the approval gate by inlining the connector call
- ❌ "Just do it, the user will catch any mistakes"
- ❌ Connectors with broad scopes ("admin:write" for everything)
- ❌ Channel allowlists that include the company-wide channel
- ❌ Auto-running mutating actions because they "feel routine"

## Verification

The verifier (class: integration + ops) will:
1. Confirm every action was classified before execution.
2. Confirm external/mutating actions have an approval timestamp.
3. Confirm the action is within the connector's scope/channel allowlist.
4. Confirm rate limits were respected.
5. Confirm a rollback note exists for mutating actions.

Fail if any action executed without classification or approval where required.

## Routing

- **Haiku**: action classification (matches request to allowed scope)
- **Sonnet**: drafting the payload
- **Opus**: only for mutating actions where the user wants reasoning about consequences before approval
