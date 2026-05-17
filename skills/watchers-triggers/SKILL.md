---
name: watchers-triggers
description: Use to define watchers (file change, schedule, webhook, metric threshold) that trigger God Mode roadmaps automatically. Turns the system from request/response into ambient infrastructure. Configs live in ~/.themeetpatel/watchers/ and are processed by scripts/watcher-daemon.js (which you run via cron or systemd).
preview: true
preview_reason: "Config CLI works; the daemon that actually fires non-cron triggers lands in v1.5. Cron-based watchers work today via system cron."
---

> ⚠ **PREVIEW** — Config CLI works. Cron-based watchers run today via system cron; daemon for file/webhook/metric triggers lands v1.5. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Watchers & Triggers

The CEO doesn't have to be asked. With a watcher in place, work starts on its own when the world changes.

## When to use

- Recurring work that should happen on a schedule ("daily standup", "weekly KPI review")
- Event-driven work ("when GitHub issue X is opened, run roadmap Y")
- Threshold work ("when error rate > 1%, page me with root-cause analysis")
- Catch-up work ("if I haven't touched the repo in 3 days, summarize what changed")

## Watcher types

| Type | Triggers on | Config field |
|---|---|---|
| `cron` | Schedule (cron expression) | `schedule` |
| `file_change` | File path / glob changed | `path` |
| `webhook` | HTTP POST to a registered endpoint | `endpoint` |
| `metric` | Numeric metric crosses threshold | `metric_url, op, value` |
| `inbox` | New email matching filter | `filter` (requires email pack) |
| `pr_opened` | GitHub PR opened (requires gh CLI) | `repo, labels` |

## Watcher config schema

`~/.themeetpatel/watchers/<name>.json`:

```json
{
  "name": "daily-standup",
  "type": "cron",
  "schedule": "0 8 * * 1-5",
  "action": {
    "kind": "god_mode_session",
    "goal": "Daily standup: summarize what shipped yesterday, what's planned today, what's stuck.",
    "constraints": "Read my calendar + GitHub + Slack catch-up."
  },
  "approval": {
    "auto_run": true,
    "require_approval_before_external_writes": true
  },
  "destinations": ["slack:#standups", "email:meet@finanshels.com"],
  "enabled": true,
  "created_at": "2026-05-17T..."
}
```

## CLI

```bash
node scripts/watchers.js add --name daily-standup --type cron --schedule "0 8 * * 1-5" --goal "Daily standup..."
node scripts/watchers.js list
node scripts/watchers.js enable daily-standup
node scripts/watchers.js disable daily-standup
node scripts/watchers.js test daily-standup     # dry-run the trigger
node scripts/watchers.js remove daily-standup
```

## Running the daemon

The watcher daemon polls configs and fires triggers. Run it via:

```bash
# Foreground (dev / debug)
node scripts/watcher-daemon.js

# Or as a launchd / systemd service (production)
# See docs/WATCHER-DAEMON.md for plist + unit examples
```

For cron-only watchers, you can skip the daemon and let actual `cron` invoke each watcher script directly.

## Anti-patterns

- ❌ Watchers that fire on too-noisy events (every file change in a busy repo)
- ❌ Watchers that auto-write to external systems without approval
- ❌ Cron watchers without an "off-hours" guard (firing at 3am wakes you up)
- ❌ Threshold watchers with no hysteresis (firing repeatedly on flapping metrics)
- ❌ Watcher whose action is "send me an alert" but doesn't actually do useful work

## Built-in safety

Every watcher defaults to:
- `auto_run: false` for non-cron triggers (you confirm first)
- `require_approval_before_external_writes: true`
- Max 1 fire per 5 min for the same watcher
- Logged to `~/.themeetpatel/watchers/log.jsonl`

## Output contract (per fire)

```
═══ WATCHER FIRE ═══
Watcher: <name>
Triggered at: <ISO>
Trigger context: <what changed>

ACTION EXECUTED:
  kind: <god_mode_session | shell_command | webhook_call>
  result: <summary>

DELIVERED TO: <destinations>
APPROVAL EVENTS: <any pauses for human-in-loop>
NEXT FIRE: <when, if recurring>
```

## Routing

Watchers themselves are config — no routing. The triggered actions follow normal God Mode routing.

## Verification

The verifier (class: ops) will:
1. Confirm every watcher has a defined action.
2. Confirm cron expressions are valid.
3. Confirm destinations are real (no dangling channel names).
4. Confirm approval flags are set conservatively by default.
