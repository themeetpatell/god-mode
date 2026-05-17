# God Mode — Slack bot

Run God Mode from any Slack workspace. `/god-mode <goal>` from a channel or DM; replies thread back with the roadmap + deliverable.

## What's in this folder

- `app-manifest.yaml` — Slack app manifest (paste into api.slack.com)
- `server.js` — minimal Express + Bolt SDK handler
- `package.json` — deps
- `README.md` — this file

## Setup (15 min)

```bash
cd surfaces/slack-bot
npm install
cp .env.example .env
# Fill SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, ANTHROPIC_API_KEY
npm run dev
```

Then create a Slack app from `app-manifest.yaml` (use api.slack.com → create app → from manifest), install it to your workspace, and point its slash command to your server's URL.

## Slash commands

- `/god-mode <goal>` — full session
- `/roadmap <goal>` — roadmap only, no execution
- `/handoff` — generate handoff brief in current thread
- `/status` — show current session state

## How threading works

Each `/god-mode` invocation creates a thread. All CEO output + verifier verdicts + final deliverable thread under the original message. The user can reply in-thread to continue the session or ask follow-ups.

## Privacy

- The bot only reads messages it's @-mentioned in or commands directed at it
- No background scraping of the channel
- All processing happens server-side (your server) — no Slack message data goes to third parties beyond the LLM API call you've already authorized
- Use `pii-redact.js` to scrub before logging

## Auth model

The bot uses Slack OAuth + per-workspace bot tokens. Roadmap state persists per workspace (not per channel) to allow cross-channel handoffs.

## What v1.4 ships

- App manifest + minimal server
- Slash command handling
- Threading
- One worked example (a `/roadmap` invocation)

## What v1.5 ships

- DM-based long sessions
- Voice-note ingest from Slack file uploads
- Approval flows for external-actions via Slack buttons
- Per-channel default pack selection
