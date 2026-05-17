# Warm-up DM templates

Send 10-20 of these in the 24 hours before (or right after) the LinkedIn post. Goal: 10 thoughtful responses on the post in the first 48h, plus early bug catches from people who'll actually install.

## Targeting order

1. **Other founders who'd actually use it** (build something, ship through chaos, would feel the verifier)
2. **AI builders / Claude API users** (would notice the routing accuracy + verifier primitive)
3. **Operators** (CoS, growth lead, finance ops — would feel the reflection skills)
4. **People who've publicly asked for X** where X is in the plugin (Slack/LinkedIn search their feed)
5. **Tech writers / podcast hosts** in your network (could amplify; not pushy though — only if real fit)

## Template — to a founder (closest tie)

```
Hey <name> —

Quietly launching tomorrow: an AI plugin I've been building for a few months called God Mode. Verified deliverables, learning router, Domain Packs.

It's the thing I wish existed when I was juggling 5 ventures.

Two asks (only if quick):
1. Would you install + try one real goal? Honest reaction matters more than a like.
2. If it doesn't work for your stack, I want to know first — better to fix it before more people see it.

Repo + post going live <day> <time> GST. Sending you the link a few hours early.

— Meet
```

## Template — to an AI builder

```
Hey <name> —

You'll have an opinion on this. Built an open-source Claude Code plugin with a learning router (100% on 104 stratified evals incl 41 adversarial) and a separate verifier that proves work actually shipped. MCP server included.

Repo: <link, share day of>

If you have 10 min: `cd mcp-server && npm run eval:routing` — try to break it. Whatever case you find that fools the router, I want as an adversarial eval row.

Launching publicly <day> — wanted you in the early review before the noise.
```

## Template — to an operator (CoS / growth / finance ops)

```
<name>, you've heard me talk about the operating-rhythm gap most founders have.

Built it. God Mode — AI plugin that runs the discipline: roadmap, route every task to the right model, verify, ship. Plus daily standup / weekly retro / quarterly OKR check automated.

Launching open source <day>. Sending you the repo a few hours early because your <CoS-side / growth-side / ops-side> perspective is the one I most want to test against.

10 minutes of "would this fit your workflow" feedback would be gold.
```

## Template — to someone who's publicly asked for X (the most powerful one)

```
Hey <name> —

You posted <link to their post about wanting / struggling with X> a while back. Been thinking about it.

Shipped a thing called God Mode that does exactly <X>: <one-sentence connection>.

Open-source, MIT, launches publicly <day>. Wanted you to see it first because of <their post>.

Repo: <link, share day of>

If it's not what you meant, no offense taken — tell me and I'll keep building.
```

## Template — to a tech writer / podcaster (use sparingly)

```
<name> —

Long shot: launching an AI plugin <day> that I think makes a category-defining bet (separate verifier agent; learning router; portable across every tool; Domain Packs architecture).

100% accuracy on 104 stratified eval cases. Open source MIT.

If you cover AI tooling and want a deeper walkthrough, happy to do 15 min. If not, no follow-up — just wanted you on the radar before the public push.

Repo: <link>
```

## Template — to early Claude Code plugin users (the marketplace community)

```
Hey <name> —

Pushing this to the Claude plugin marketplace tomorrow: God Mode. CEO orchestrator + verifier + learning router + Domain Packs.

Would you be willing to be one of the first 10 installs? `/plugin marketplace add https://github.com/themeetpatel/god-mode && /plugin install themeetpatel@themeetpatel`

Reply with one bug or one thing you wish it did. That's the kind of feedback that shapes v1.4.
```

## Anti-patterns (don't send these)

- ❌ "Hey hope you're well, I wanted to share something I built" (already AI-tell)
- ❌ Mass-merge without the personalization line
- ❌ "Big launch tomorrow!" (no specifics, no ask, no value)
- ❌ Ask for a like / comment / share (let the work earn it)
- ❌ Send to people who haven't engaged with you in 6+ months (cold-warm at best)

## Response-handling

| They say | You say |
|---|---|
| "Looks great, will check it out" | "Awesome — link is `<link>`. If anything breaks, DM me the exact command + error, I'll patch within 24h." |
| "Not really my space" | "All good, thanks for taking a look. If you know <one other person>, would mean a lot." |
| "Send me the repo" | Send. Then 24h later: "Did it install cleanly? Any first impression?" |
| "I'll test it tomorrow" | "Cool. One specific ask: try `node scripts/cost-preflight.js --file examples/01-landing-page.md` first — that's the 30-second wow." |
| "How is this different from <X>" | Use the script from `post-comments.md` (the "how is this different from <X agent framework>" answer) |

## Tracking

Keep a simple list:

```
| name | sent | replied | installed | feedback summary |
| Sarah | T-1d | T-1d  ✓ | T+0  ✓ | Loved verifier; bug on Windows path |
| Faris | T-1d | T-0    | T+1  ✓ | Will write a thread |
```

If 8/10 install and 3+ give substantive feedback, that's a green light for wider push (paid distribution, podcast outreach, etc.).
