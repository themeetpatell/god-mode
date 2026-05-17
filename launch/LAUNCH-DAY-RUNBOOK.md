# Launch Day Runbook — God Mode v1.3.1

Single-source-of-truth for the 90-minute push from "files in folder" to "shipped + posted." Copy-paste-able commands in order. Do not skip the dogfood window.

## T-7 days: dogfood window

Before any public push, use the system on real goals for 3-5 days. Goal: catch anything weird in YOUR environment that didn't show up in my testing.

```bash
# 1. Initialize your memory with the seed
cp launch/memory-seed-meet.json ~/.themeetpatel/memory/default.json
# edit any fact that's drifted

# 2. Run a few real sessions
# Use /god-mode <real goal> in Claude Code, or paste portable/universal-system-prompt.md into your tool of choice

# 3. After 3 days, check the ledger
node scripts/ledger.js                              # should show real sessions + savings
node scripts/reflection-journal.js week             # should show real episodes + patterns
node scripts/route-accuracy.js                      # confirms router still at 100% gates

# 4. Try the v1.3.1 production additions on something real
node scripts/cost-preflight.js --file <your-roadmap.md>
node scripts/reversibility-scorer.js --action "the next thing you're about to do"
node scripts/beliefs.js --add "<a real belief you want the system to track>" --confidence 0.8

# 5. Catch anything broken, fix it, repeat
```

If anything is genuinely broken (not just preview-scaffold expected behavior), fix before going public.

## T-1 day: pre-flight checks

```bash
cd /Users/themeetpatel/Downloads/08_Skills_AI_Tools/themeetpatel_god_mode

# Repo hygiene
./scripts/github-init.sh                           # adds .gitignore rules, untracks dist/, sanity checks
git status                                          # confirm clean working tree

# Build + eval gate
cd mcp-server
npm install
npm run build
npm run eval:routing                                # must show overall ≥ 85%, adversarial ≥ 70% (we're at 100%/100%)
cd ..

# Sanity check secrets aren't tracked
git ls-files | xargs grep -l "sk-ant-\|AKIA\|password\s*=" 2>/dev/null
# should output nothing

# Confirm LICENSE + CHANGELOG present
ls -la LICENSE CHANGELOG.md LAUNCH-PROFILE.md CONTRIBUTING.md README.md

# Confirm plugin.json version
grep version .claude-plugin/plugin.json
# should say "1.3.1"
```

## Launch day morning (~30 min): publish the repo

```bash
# 1. Commit and tag
git add -A
git commit -m "v1.3.1 — Launch release. See CHANGELOG.md for the full surface."

# 2. Create the public repo
gh repo create themeetpatel/god-mode \
  --public \
  --source=. \
  --description "AI operating layer with verified deliverables, learning router (100%/100% on stratified evals), and Domain Packs. Plugin + MCP server + portable prompts for every tool." \
  --homepage "https://themeetpatel.dev" \
  --remote=origin \
  --push

# 3. Tag and release
git tag -a v1.3.1 -m "v1.3.1 — Launch release"
git push origin v1.3.1

gh release create v1.3.1 \
  --title "v1.3.1 — Launch release" \
  --notes-file launch/RELEASE-NOTES-v1.3.1.md

# 4. Add repo topics for discoverability
gh repo edit --add-topic ai,claude,claude-code,mcp,agent,orchestration,roadmap,verifier,router,founder-tools,model-routing,plugin,llm,llmops,evals
```

## Launch day morning (~30 min): publish the landing page

```bash
# Option A — Vercel (fastest)
cd launch
npx vercel deploy landing.html --prod
# point themeetpatel.dev DNS at the Vercel URL

# Option B — Netlify
# drag-drop launch/landing.html onto app.netlify.com/drop

# Option C — Cloudflare Pages
# git connect — Cloudflare Pages will auto-deploy on every push
```

Update DNS for `themeetpatel.dev` → the deploy URL. (If you don't own the domain yet, register it now — Namecheap / Cloudflare Registrar, ~$15/yr.)

## Launch day morning (~20 min): take screenshots

Open these in order and screenshot each. Save to `launch/images/`. See `launch/screenshot-kit.md` for the full shotlist.

1. **Exec summary with `VERIFIED:` line** — run a real `/god-mode` goal in Claude Code, screenshot the final 6-line summary
2. **Dashboard** — open `launch/dashboard.html` in browser at desktop width, full-page screenshot
3. **Router eval** — `cd mcp-server && npm run eval:routing`, screenshot terminal
4. **Roadmap** — run `/roadmap <a real multi-phase goal>` in Claude Code, screenshot the roadmap output
5. **Cost ledger** — `node scripts/ledger.js`, screenshot

For the LinkedIn post: pin shot #1 (exec summary) — that's the differentiator.

## Launch day afternoon (~15 min): post to LinkedIn

1. **Pick the variant** from `launch/linkedin-launch-post.md` (A is recommended).
2. **Paste the post body**, attach screenshot #1.
3. **DO NOT include the GitHub link in the post body.** Drop it in the first comment instead (LinkedIn rewards link-free posts).
4. **Schedule** for Tuesday or Wednesday 8am GST (best B2B time) OR Sunday 8pm GST (UAE-specific peak).

After posting, drop these as the first three comments in order (copy-paste from `launch/post-comments.md`):

```
Comment 1 (immediately after posting):
🔗 GitHub: https://github.com/themeetpatel/god-mode

Comment 2 (1 hour after):
Install one-liner in Claude Code:
/plugin marketplace add https://github.com/themeetpatel/god-mode
/plugin install themeetpatel@themeetpatel
/god-mode <your goal>

For other tools, paste portable/universal-system-prompt.md into the tool's instructions. Same discipline, single-model context.

Comment 3 (next morning):
For the AI builders here — the most interesting file in the repo is mcp-server/src/router.ts. 
104 stratified eval cases, 41 adversarial. 100% / 100%. The whole point is that routing accuracy compounds.
```

## Launch day +24h: warm-up DMs

DM these 10-20 people in your network with the personalized variant from `launch/warm-up-dms.md`. Goal: 10 thoughtful responses on the first 48h to build social proof and surface bugs.

Order:
1. Other founders who'd actually use it
2. AI builders / Claude API users
3. Operators (Chief of Staff, growth leads)
4. People who've publicly said "I want X" where X is in the plugin
5. Tech writers / podcast hosts in your network

## Launch day +1 week: collect signal

```bash
# What patterns are emerging from your own usage?
node scripts/reflection-journal.js week

# Are people using it?
gh repo view themeetpatel/god-mode --json stargazerCount,issues,forks
gh issue list --repo themeetpatel/god-mode

# Run the eval suite again to confirm no regressions if you've taken contributions
cd mcp-server && npm run eval:routing

# Update the CHANGELOG with anything you've patched
```

If you've got > 10 stars + > 3 contributors / issues in week 1, that's the signal to start v1.4 production wiring (cross-vendor router → Slack bot → webhook ingress → computer-use → vision-roadmap).

## If something goes wrong

| Problem | Fix |
|---|---|
| Plugin install fails on someone else's machine | Check Node 20+; check they ran `npm install` in mcp-server/; check their `~/.themeetpatel/` permissions |
| Router eval fails locally | Confirm `mcp-server/dist/` got built (`npm run build`); pull latest weights |
| `gh release create` fails | Confirm `gh auth status`; if not logged in, `gh auth login` |
| LinkedIn post gets < 100 impressions in first hour | Re-post at peak time; rewrite the hook; the first hook line is 70% of the reach |
| Issue / bug filed in repo | Triage in 24h; if real, fix + tag a v1.3.2 patch immediately |
| Someone asks "is this just hype" | Point them at `mcp-server/src/router.ts` + `evals/routing-eval.jsonl` + `scripts/verify/`. Real code wins arguments. |

## Done state

When this runbook is fully executed:
- [ ] Repo public at github.com/themeetpatel/god-mode
- [ ] v1.3.1 release tagged
- [ ] Landing page live at themeetpatel.dev
- [ ] LinkedIn post live with screenshot + 3 follow-up comments
- [ ] 10-20 DMs sent
- [ ] ~/.themeetpatel/ populated with your real memory
- [ ] First 3 days of real-use telemetry in your ledger

Then start v1.4 production wiring.
