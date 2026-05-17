---
name: partnerships-outreach
description: Use for partner ICPs, channel/referral GTM, LinkedIn DMs, cold email sequences, WhatsApp scripts (UAE/GCC + India), headhunting outreach, community-circulation posts, and any outbound where the goal is reply rate and qualified meetings. Ships with channel-specific cadence, message templates, follow-up logic, and tracking — not generic "personalize your outreach" platitudes.
---

# Partnerships & Outreach

The only metric that matters is qualified reply → meeting → revenue. Everything else (open rates, sentiment, "engagement") is noise.

## When to use

- Channel partner / referral motion design
- Cold outbound campaign (email, LinkedIn, WhatsApp)
- Headhunting / candidate outreach
- Community-led distribution (post-in-X-WhatsApp-group, founder-DMs)
- Win-back outreach to lapsed customers
- Press / podcast outreach

## When NOT to use

- Inbound nurture (use lifecycle automations from `growth-engine`)
- Sales conversation once they're already in a meeting (use a sales playbook, not a script)
- Customer comms (use `internal-comms` if internal, custom CRM if external)

## The protocol

### Phase 1 — Pick the partner / prospect ICP

Different from your buyer ICP. A good partner has:

- **Adjacency** — their customers are your customers, or one step away
- **Asymmetry** — they have what you lack (distribution, trust, integration), and vice versa
- **Incentive alignment** — they get something real from sending business your way (referral rev, customer happiness, product completeness)
- **Activation capacity** — they can actually move volume (they have an audience / sales team / customer base)
- **Counterparty risk low** — they're not a competitor, not unstable, not a brand risk

Score candidates on these five before writing a single message.

```
PARTNER ICP:
  Type: <e.g., accounting firm in UAE serving SMBs>
  Why their customers are our customers: <one sentence>
  What they have we want: <distribution / trust / customer access>
  What we have they want: <product / margin / co-marketing>
  Volume potential: <deals/month if motion works>
  Counterparty risk: <low / medium / high>
```

### Phase 2 — Channel pick (per ICP, not "all channels")

| Channel | Best for | Reply benchmarks |
|---|---|---|
| **Cold email** | Named B2B prospects, repeatable | 15-30% open, 3-8% reply at high quality |
| **LinkedIn DM** | Mid-market and up, when prospect's title is visible | 30-50% accept, 10-25% reply on warm |
| **LinkedIn voice note** | Mid-funnel, when text isn't working | 2-3× text reply rate when well-done |
| **WhatsApp** | UAE/GCC/India SMB, warm intros | 60-80% read, 30-50% reply if warm |
| **Twitter/X DM** | AI/tech founders, with shared context | 5-15% on cold, 30%+ if warm |
| **Phone (still)** | Enterprise, post-context | When email and LinkedIn fail |
| **In-person event** | Highest-trust, lowest-volume | Best fit for partnerships above $50K deals |

Pick ONE channel per ICP. Sequence within the channel before adding channels.

### Phase 3 — Message contract (every message, no exceptions)

```
SUBJECT / OPENER:
  - Specific reason for reaching out (NOT "Hope you're well")
  - Reference an event / post / shared context — REAL not fake
  - ≤ 8 words for email subject, ≤ 1 line for DM opener

ACKNOWLEDGEMENT:
  - One line proving you know who they are
  - NOT "I see you're the CMO at <company>" — that's spam
  - DO "Your post on Q1 closing the GCC SMB team in 90 days lined up exactly with what I'm seeing with my customers" — specific

ASK:
  - One ask, in one sentence
  - The ask must be cheaper than the value: 15-min call, intro to one person, reply with "yes/no"
  - NOT "let's set up a meeting to explore synergies"

WHAT'S IN IT FOR THEM:
  - One sentence, concrete
  - Mutual benefit > "I'd love to learn from you"

CTA:
  - Single, clear
  - Email/DM: "Open to a 15-min next Tue/Wed?" or "Worth a quick reply?"
  - WhatsApp: voice note or 15-min call slot offered
```

### Phase 4 — Sequences (multi-touch, with stop rules)

**Cold email B2B (named accounts):**

```
DAY 0 — Cold
  Subject: <specific noun, not "Quick question">
  Body: [Opener with REAL trigger] + [Acknowledgement] + [Ask] + [WIIFT] + [CTA]
  Length: 50-90 words

DAY 3 — Bump
  Reply to thread: 1 sentence + same CTA
  "Re: <previous subject>"

DAY 7 — Add value
  Subject: <new, value-led, e.g., "Saw your team grew 3 — sending an idea">
  Body: a useful insight or asset for them, with no ask
  CTA: optional, soft

DAY 12 — Break-up
  Subject: "Closing the loop"
  Body: 2 sentences. Acknowledge they're busy. Make it easy to say no or "later." Mention you'll revisit in <Q>.

THEN STOP for 60 days minimum. Respect the no.
```

**LinkedIn outbound (mid-market):**

```
DAY 0 — Connect request
  Personal note ≤ 200 chars referencing real context
  NO sales pitch in connect request

DAY 1-3 (post-accept) — First DM
  Thanks for connecting + REAL acknowledgement + soft ask (NOT a meeting yet)
  ≤ 80 words

DAY 5 — Value drop
  Asset, insight, or relevant intro — no ask
  ≤ 50 words

DAY 9 — Soft meeting ask
  "Worth a 15-min call?" + one specific value prop for THEM

DAY 14 — Last touch
  "Did this fall off your radar or is it not a fit?" — direct, respectful close
```

**WhatsApp warm (UAE/GCC pattern):**

```
INTRO (from mutual contact)
  Mutual intro you (sender) + prospect, with one-line context

DAY 0 — Open
  Voice note or text, with respect for cultural pleasantries (greeting + brief context + ask for a call)
  Don't pitch in writing — pitch live

DAY 3 — Follow-up
  Short, no urgency

DAY 7 — Last
  Polite close, leave door open
```

Stop rules:
- Hard no → mark as do-not-contact, never auto-resequence
- "Not now, ping in <month>" → put in tickler, ping ON that date with a soft hello
- No response after sequence → 60-day silence minimum

### Phase 5 — Personalization that's NOT fake

Real personalization signals:
- A post they wrote in the last 30 days
- A hire they announced
- A funding round, acquisition, launch, talk, podcast appearance
- A common former employer, school, community
- A customer or prospect you share
- Something written about their company recently (real news)

Fake personalization that prospects detect:
- "I see you work at <company>"
- "I noticed your <generic title>"
- LLM-generated "compliment" on something they didn't write
- "Quick question" / "Quick favor" / "Picking your brain"
- Mass-merge fields that landed weird ({{first_name}} as "Hi <First>")

If the personalization isn't real, send the unpersonalized version. It's more respectful.

### Phase 6 — Tracking + iteration

Required:

| Metric | Per cadence |
|---|---|
| Sent | n |
| Delivered | n (bounces, spam filters) |
| Opened (email) | n / % |
| Replied | n / % |
| Reply quality | qualified / unqualified |
| Meeting booked | n |
| Meeting attended | n |
| Opportunity created | n |
| Closed-won | n |
| Revenue | $ |

If you can't measure all of these, you can't optimize. Set up the CRM fields before launching.

Weekly review:
- Where in the sequence do replies cluster? (Tells you which message to A/B)
- What ICP segments reply best?
- Which subject lines win?
- Which sender (if multiple senders) wins?

### Phase 7 — Deliverable shape

```
═══ OUTREACH CAMPAIGN BRIEF ═══
Campaign: <name>  ICP: <segment>  Owner: <name>  Channel: <one>

ICP SCORING (5 axes):
- Adjacency: <score / notes>
- Asymmetry: <score / notes>
- Incentive alignment: <score / notes>
- Activation capacity: <score / notes>
- Counterparty risk: <score / notes>

LIST SOURCE:
- <how the list was built, with cleanliness notes>
- Size: <n>
- Enrichment: <what fields are present>

MESSAGE TEMPLATES (per touchpoint):
DAY 0 — <full message>
DAY 3 — <full message>
DAY 7 — <full message>
DAY 12 — <full message>

PERSONALIZATION TOKENS:
- <what each {{var}} maps to>
- <how it's sourced>

OFFER:
- Primary offer: <what>
- Risk reversal: <what>
- Why it's right for THIS ICP: <one line>

CTA LADDER:
- Soft: <reply with "yes/no">
- Hard: <15-min meeting via Calendly>

TRACKING:
- CRM fields to capture: <list>
- Dashboard: <link>
- Weekly review cadence: <day>

GUARDRAILS:
- Stop rules: <list>
- Daily send cap: <n>
- Spam-trigger phrases to avoid: <list>
- Compliance (GDPR/UAE PDPL/CAN-SPAM): <opt-out, footer, etc.>

SUCCESS CRITERIA (30 days):
- Replies: <n>
- Qualified replies: <n>
- Meetings booked: <n>
- Opportunities: <n>
- Pipeline: $<n>

KILL CRITERIA:
- If <metric> below <threshold> by day 14, iterate or kill
```

## Anti-patterns

- ❌ "Hope you're well" / "Hope you had a great weekend"
- ❌ "Quick question" / "Picking your brain" / "Could you point me in the right direction"
- ❌ 4-paragraph cold email
- ❌ Asking for a meeting in the connect-request note on LinkedIn
- ❌ Mass-sending the same message with no list cleaning
- ❌ Sending Mon 9am or Fri 5pm
- ❌ Using "ASAP" / "URGENT" / fake scarcity
- ❌ "Per my last email" (passive-aggressive, lowers reply rate)
- ❌ Sending more than 4 touches without a meaningful value drop
- ❌ Re-sequencing a "no" reply
- ❌ Pretending you've met when you haven't

## Reply-handling playbook

| Reply type | Response |
|---|---|
| "Yes interested" | Send calendar link within 2 hours, day-of if possible |
| "Not now, later" | Acknowledge, set a tickler, ping on the date they gave |
| "Not a fit — try <colleague>" | Thank them, intro request, never bypass to the colleague without permission |
| "Take me off your list" | Honor immediately, no apology paragraph |
| "Tell me more" | One follow-up with the 3 most important things, ask if they want the demo or the asynchronous version |
| Silence after value-drop | One last polite touch, then stop |

## Worked example (cold email, B2B UAE SaaS)

```
TO: <name>, CFO, <UAE SMB>
DAY 0 SUBJECT: VAT-ready receivables for <company>
BODY:

Hi <name>,

Your post last week about the e-invoicing rollout — yeah, that's exactly what's been keeping FOps leads in Dubai up at night. (My customers say the same.)

We built receivables automation that's AED-native, FTA-compliant, and books 3 weeks of FOps work in 1 day. Most of our UAE customers were live in 7 days.

Worth a 15-min call next Tue or Wed to see if it fits?

— Meet
finanshels.com
```

70 words. One real trigger (their post). One specific ask. One CTA. Compliant with UAE PDPL because of the opt-out footer (not shown).

## Routing

- **Haiku**: generating subject-line variants, follow-up bumps
- **Sonnet**: default — full campaign brief, message drafts, list strategy
- **Opus**: only when the partnership is highest-stakes (a single deal that defines the year)

## Verification protocol

The `verifier` (class: content + comms) will:
1. Every message ≤ word limit for its channel.
2. No banned phrases ("Hope you're well", "Quick question", etc.).
3. Real personalization signal cited.
4. Single ask per message.
5. CTA is concrete and time-bounded.
6. Stop rules defined.
7. Tracking + success/kill criteria stated.
8. Compliance footer present for email.

Fail if more than 2 banned phrases, if no real personalization signal, or if no stop rules.
