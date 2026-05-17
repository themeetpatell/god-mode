---
name: whatsapp-sales-script
description: Use for UAE/GCC + India sales WhatsApp scripts — first reach-out, follow-up cadence, voice notes, objection handling, demo scheduling, dispute resolution. The region's dominant business channel, with cultural pleasantries and authority cues baked in. Bilingual variants (English, Arabic, Hinglish) where appropriate.
---

# WhatsApp Sales Script (UAE/GCC + India)

WhatsApp is the dominant SMB business channel in this region. Cold email lands in spam. WhatsApp lands in the owner's pocket. Treat it accordingly.

## When to use

- Warm-intro follow-up after a referral
- Outbound to UAE/GCC SMB owners (warm only — cold WhatsApp is illegal under PDPL without consent)
- India-side counterparts (different norms, see below)
- Demo confirmation + reminders
- Objection handling mid-conversation
- Dispute / collection flows

## When NOT to use

- Cold outbound to people who haven't opted in (PDPL violation, also kills your number)
- Long technical pitches (use a deck or call)
- Mass-merge campaigns (kills the channel + the number reputation)

## Cultural norms

### UAE / GCC
- Greet first. Always. "Salaam <name>" or "Good morning <name>" before any business.
- Voice notes are accepted and often preferred for warm context. Keep < 60 seconds.
- "Inshallah" is an honest yes in religious context, a polite hedge in others. Don't take "inshallah" as a hard commit; clarify with a date.
- Friday is the weekend (now Sat-Sun officially in UAE, but Friday afternoon prayers still slow business).
- Ramadan: shifted working hours, reduced bandwidth. Plan around it.
- Tone: respectful, warm, but direct enough to make decisions. Don't be falsely casual.

### India
- Pleasantries lighter than UAE but still present ("Hi <name>" not "<name>:")
- Voice notes accepted; English text works for most B2B
- "Will revert" / "let me check internally" = decision unknown. Pin a date.
- Festival calendar matters: Diwali week is slow, year-end (Mar 31) is fast.

## Message templates

### 1. Warm intro follow-up (after a referral)

```
Salaam <name> 🌙

<Mutual> mentioned you might be open to a quick chat about <one-line topic relevant to their business>.

Would Tuesday or Wednesday next week work for a 15-min call? I'll keep it tight.

— <your name>
<your company> | <city>
```

Then optionally a voice note (≤30s) introducing yourself in your own voice.

### 2. Follow-up #1 (no reply after 3-4 days)

```
Hi <name>, just floating this to the top. Free for a quick 15 min Tue or Wed?
```

### 3. Follow-up #2 (still no reply, ~7 days after first)

```
Hi <name>, last nudge from me — if not the right time, totally fine. Should I check back in 4-6 weeks?
```

Then stop. Respect the silence.

### 4. Demo confirmation (24h before)

```
Hi <name>, confirming our call tomorrow <day> at <time GST>.

I'll send a calendar with the link in a sec.

Anything specific you want me to focus on?
```

### 5. Demo reminder (2h before)

```
Hi <name>, looking forward to our call in 2 hours. Link: <calendar link>

Let me know if anything shifts.
```

### 6. Post-demo follow-up (same day)

```
Hi <name>, thanks for the time today.

Quick recap of what we agreed:
- <decision / next step>
- <decision / next step>

I'll send you <asset> by <day> and follow up <day>.

Anything I missed?
```

### 7. Pricing discussion (text version of the call)

```
Hi <name>, as discussed:

Our SMB plan: AED <X>/mo
What's included: <3-4 bullets>
Onboarding: included, ~7 days
Risk reversal: month-to-month, cancel anytime, no setup fee

Want me to send the order form?
```

(For voice note version, lead with the price aloud, then text the breakdown after.)

### 8. Objection handler — "Send me an email"

When they ask for email after WhatsApp, they're often deflecting. Respond:

```
Sure — but let me ask first: what would you want to see in the email?

If it's: <pricing>, <case study>, <a specific feature> — I can share the answer right here in 2 mins.

If you'd like the formal deck for internal forwarding, totally — say the word and I'll send it.
```

This separates "I need a doc for my boss" from "I'm not into this."

### 9. Objection handler — "Send me a proposal"

```
Happy to. Two quick checks first so the proposal is useful:

1. What outcome are you trying to hit in the next 90 days?
2. What's the rough budget range we're working in?

That keeps the proposal tight instead of generic.
```

### 10. Dispute / collection (overdue invoice)

```
Hi <name>, hope you're well. Quick reminder that invoice #<n> for AED <amount>, dated <date>, is overdue by <days>.

If there's an issue with the invoice, let me know and we'll sort it.
If it's a cash-flow timing thing, also fine — please tell me the date you can clear by.

Want to keep things smooth on our end so we can keep delivering on yours.
```

If no reply within 5 working days:

```
Hi <name>, following up on invoice #<n>. Could you confirm a payment date this week?
```

Escalation script (final, before paused service / legal):

```
Hi <name>, given invoice #<n> is now <days> overdue with no confirmation, we'll need to pause <service> from <date> until cleared. Please confirm payment ASAP to avoid disruption.

I'd rather solve this on a quick call — are you free today?
```

### 11. Off-hours / weekend (set boundary, polite)

If they message you at 11pm Friday:

```
Hi <name>, picking this up Sunday morning — quick: <1-line acknowledgement>.

Will revert with detail Sunday.
```

You signal you saw it without doing the work then. Owners respect boundaries when modeled.

## Anti-patterns

- ❌ Cold WhatsApp to a number you scraped — PDPL violation + WhatsApp ban risk
- ❌ Mass-sending via API to non-consented numbers
- ❌ All-caps urgency ("URGENT!!!")
- ❌ Voice notes > 60 seconds for first touch
- ❌ Pitching in the first message before establishing context
- ❌ Following up more than 3 times without a value drop
- ❌ Sending the same content over WhatsApp AND email AND LinkedIn the same day (annoys the buyer, conveys desperation)
- ❌ Forgetting timezone (Asia/Dubai = GST = UTC+4)

## Format conventions

- Emojis: 0-1 per message. 🌙 / 🙏 OK in UAE warm context. Avoid 🔥 / 💯 in B2B.
- Bold via WhatsApp's `*bold*` syntax for the ONE key word
- Avoid links in the first message (looks like spam)
- Always sign with name + company short form

## Tracking

Every WhatsApp conversation should be logged in CRM with:
- Contact + date + warm/cold source
- Message snapshots at key moments
- Status (open, in conversation, demo booked, won, lost, snoozed)
- Reason if lost or snoozed

If your CRM doesn't capture WhatsApp easily: WATI, Trengo, or a Twilio bridge. Don't run it from a personal phone with no log — you'll lose it.

## Routing

- **Haiku**: simple bumps and confirmations
- **Sonnet**: default — drafts, objection handling
- **Opus**: only for dispute/collection messages where legal exposure exists
