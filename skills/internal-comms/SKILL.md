---
name: internal-comms
description: Use for internal emails, Slack updates, all-hands narratives, policy announcements, performance warnings, incident comms, layoff/restructure messages, hiring announcements, and any communication that goes from the company to employees or from a leader to a team. Built on the operator principle "make the next action impossible to miss."
---

# Internal Comms

The right internal message moves people. The wrong one creates a meeting to clarify the message. This skill ships the first kind.

## When to use

- Email or Slack from a leader to a team / company
- Policy announcement (return-to-office, security policy, compensation philosophy)
- Performance warning, PIP letter, escalation message
- Incident comms (outage, security incident, customer issue)
- All-hands narrative / town hall script
- Restructure, layoff, or hiring announcement
- Cross-functional update / 3P (Progress, Plans, Problems)
- Operating cadence note ("we're moving standup to Wednesdays")

## When NOT to use

- External customer comms (different rules, different stakes)
- Founder-led public content (use `founder-content`)
- Sales/partner outreach (use `sales-copywriter`)

## The contract

Every internal comm has these slots, in this order:

```
SUBJECT / TITLE: <a real specific noun, not "Update">
TL;DR: <one sentence — what changed and what to do about it>
WHY: <the trigger, the decision, the context>
WHAT: <the change, in concrete terms>
WHEN: <effective date / deadline>
WHO: <named owners, named affected groups>
WHAT YOU DO NOW: <the action — impossible to miss>
WHERE TO ASK: <a real place: thread, person, doc>
ESCALATION: <if relevant>
```

If you can't fill all 9 slots, the comm isn't ready. Either you don't have a real change to announce, or you don't know the answer yourself.

## The template library (8 recurring types)

### 1. Policy announcement

```
SUBJECT: New <thing> policy, effective <date>
TL;DR: We're <change>. Starting <date>, please <action>.

WHY: <2-4 sentences — the real reason, not "to improve productivity">
WHAT'S CHANGING: <bullets — before / after>
WHAT'S NOT CHANGING: <pre-empt the rumor>
EFFECTIVE: <date>
OWNER: <name>
QUESTIONS: <thread link or office hours slot>
```

### 2. Performance warning (manager → report)

```
SUBJECT: <name>, performance feedback — <month>
TL;DR: <name>, your <specific behavior/output> isn't meeting the bar I need. Let's talk and align on what changes by <date>.

CONTEXT: <specific examples — dates, what happened, what was expected>
THE GAP: <the bar vs the observed>
WHAT I NEED YOU TO DO: <specific behaviors / outputs, with cadence>
HOW WE'LL CHECK: <weekly 1:1, scorecard, deliverable>
TIMELINE: <30 / 60 / 90 days>
WHAT HAPPENS IF: <honest about consequences>
SUPPORT AVAILABLE: <coaching, time, resources>

I want you to succeed here. Let's meet <date / time>.
```

(This is HR-sensitive. Always advise the user to have HR review before sending if in a regulated context.)

### 3. Incident comm (internal during/after)

```
SUBJECT: [INCIDENT] <one-line summary> — <status: ongoing / mitigated / resolved>
TL;DR: <one sentence — what's broken, what customers see, what we're doing>

TIMELINE (UTC):
HH:MM — <event>
HH:MM — <event>

IMPACT:
- Customers affected: <count or %>
- Functionality: <what they can / can't do>
- Data risk: <yes / no / unknown — be honest>

WHAT WE'RE DOING NOW:
- <action> — owner: <name>
- <action> — owner: <name>

NEXT UPDATE: <when, channel>

INCIDENT COMMANDER: <name>
WAR ROOM: <link>
```

### 4. Layoff / restructure announcement

```
SUBJECT: Important update from <CEO name>
TL;DR: We are restructuring. <N> roles are being eliminated. Affected colleagues are being told individually today.

DECISION: <what>
WHY: <honest — the real cause: revenue, cash, strategy shift>
WHO IS AFFECTED: <how affected people are being notified, and when>
TRANSITION SUPPORT: <severance, benefits, references, alumni network>
WHAT THIS MEANS FOR THE REST OF US:
- <strategy going forward>
- <how priorities shift>
- <what isn't changing>

I OWN THIS: <CEO statement of accountability>

ALL-HANDS: <time, link>
INDIVIDUAL QUESTIONS: <HR contact>
```

This is the highest-stakes comm a company sends. Get HR + legal review. Do not let the AI write the final version — the AI drafts, the leader edits and signs.

### 5. 3P update (Progress / Plans / Problems)

```
SUBJECT: <team> — week of <date>

PROGRESS (what shipped):
✓ <thing>
✓ <thing>

PLANS (what ships next):
→ <thing> by <date> — owner: <name>
→ <thing> by <date> — owner: <name>

PROBLEMS (what's blocked / at risk):
⚠ <thing> — needs: <decision / resource / unblock> — owner: <name>
⚠ <thing>

ASK: <one specific ask of the reader, if any>
```

### 6. Hiring announcement

```
SUBJECT: Welcome <name>, joining as <role>

<Name> joins <team> on <date> as <role>. They'll own <specific scope>.

Before <company>: <one sentence — what they did and why it's relevant>
Why we hired them: <one sentence — what gap they fill>
First 30 days: <what they'll focus on>

Say hi: <Slack handle, email>
```

### 7. Operating cadence change

```
SUBJECT: Changing our <cadence>: <new>

WHAT: <before → after>
WHY: <the reason, in 2 sentences>
WHEN: starting <date>
WHO RUNS IT: <name>
PREP REQUIRED: <if any>
SUCCESS LOOKS LIKE: <one criterion>

Try it for <N weeks>. Feedback: <thread / person>.
```

### 8. Decision recap

```
SUBJECT: Decision recap — <decision name>

DECIDED: <one sentence>
DECIDED BY: <named person / forum>
DATE: <date>

CONTEXT: <2-3 sentences>
OPTIONS CONSIDERED:
- <option> — rejected because <reason>
- <option> — rejected because <reason>
- <chosen option> — chosen because <reason>

WHAT THIS MEANS:
- <impact on team A>
- <impact on team B>

WHAT WE'LL WATCH FOR: <signals this decision was right or wrong>
REVISIT: <date or trigger>
```

This is the most underused template in any company. Decisions made and not documented get re-litigated forever.

## Anti-patterns

- ❌ "Quick update" subject lines (it's never quick, and "update" tells no one anything)
- ❌ Burying the change in paragraph 4
- ❌ Passive voice when accountability is involved ("the decision was made")
- ❌ Hedging the real reason ("strategic alignment" when you mean "we ran out of money")
- ❌ Hiring announcements that brag about the person instead of explaining the gap
- ❌ "Per our discussion" / "Circling back" / "Friendly reminder" — corporate filler
- ❌ Telling people "feel free to reach out" instead of giving a specific person/place
- ❌ Performance warnings that don't say what happens if behavior doesn't change

## Tone calibration

| Audience | Tone |
|---|---|
| Whole company, change | Firm, clear, accountable. CEO voice. |
| Team, operating | Direct, peer-to-peer. Manager voice. |
| 1:1, performance | Caring + specific + non-negotiable. |
| Board / investors | Concise + data-backed + risk-aware. |
| Cross-functional ask | Specific + reciprocal. |
| Incident / customer | Honest + factual + action-oriented. |

## Worked example

Bad version (typical):

> Subject: Quick update on remote work
> Hi team, As we continue to navigate our evolving workplace, we wanted to share some thoughts on remote work flexibility. Going forward, we'll be embracing a hybrid model that empowers our team to do their best work. Feel free to reach out with any questions!

Anti-patterns: 5. Specificity: 0. Action: unclear. Rewrite.

Good version:

> Subject: New office policy, effective June 1: 3 days in, 2 days remote
>
> TL;DR: Starting June 1, everyone (except formally approved remote-only) is in the Dubai office Tue/Wed/Thu. Mon and Fri are remote-by-default.
>
> Why: Engineering velocity has dropped on cross-team projects. Three Q1 launches slipped, all on cross-team work. We've tried async-first for 14 months. It works for individual work and breaks for collaborative work.
>
> What's changing: Tue/Wed/Thu in-office for all team members hired against a Dubai-based JD. No exceptions for new hires after April 1.
>
> What's not changing: Existing remote-only contracts. Friday async stays. PTO and core hours unchanged.
>
> Effective: June 1.
>
> Owner of this policy: <CEO>. Owner of the rollout: <Head of People>.
>
> Questions: #policy-questions channel, or 1:1 with <Head of People>. AMA: Wednesday May 21, 4pm GST.

That's the difference.

## Routing

- **Haiku**: 3P updates, hiring announcements, cadence-change notes
- **Sonnet**: default for most internal comms
- **Opus**: layoff/restructure, performance warnings (anything with HR/legal exposure)

## Verification protocol

The `verifier` (class: comms) will:
1. Check the 9-slot contract is filled.
2. Check the subject line names a specific noun (not "Update").
3. Check there's a specific named owner and a specific deadline / effective date.
4. Run anti-pattern detector for corporate filler.
5. For HR-sensitive comms, flag for human + legal review explicitly.

Conditional pass if tone needs leader's signature voice (always — the AI never publishes under the leader's name without their edit).

## Always

End the deliverable with: "**Have <named person> read this before sending. Then send.**"
