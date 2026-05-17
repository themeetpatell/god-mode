# A2A — Agent-to-Agent Protocol

A spec for one God Mode instance to hand off work to another God Mode instance (across users, machines, organizations). Federated workflows without shared infrastructure.

## Motivation

Today's handoff brief assumes a human is the bridge: instance A writes a brief, the human pastes it into instance B. A2A removes the human as the message bus for the cases where the receiving party has already consented to receive work.

## Trust model

Every A2A connection requires:
1. **Sender identity** — signed payload with the sender's public key
2. **Receiver consent** — explicit allowlist of senders the receiver accepts work from
3. **Scope constraint** — what kinds of work the receiver will execute vs reject
4. **Audit** — every A2A exchange logged on both sides

No A2A connection is created implicitly. A new sender requires explicit human approval on the receiver side.

## Message envelope

```json
{
  "version": "a2a-1",
  "from": {
    "instance_id": "uuid",
    "user_id": "meet@finanshels.com",
    "pubkey": "ed25519:..."
  },
  "to": {
    "instance_id": "uuid",
    "user_id": "partner@acme.com"
  },
  "ts": "ISO",
  "intent": "handoff | request | notify | response",
  "thread_id": "for multi-turn",
  "payload": {
    "goal": "...",
    "context": "curated, not full session",
    "constraints": "...",
    "deadline": "ISO?",
    "expected_response_format": "..."
  },
  "scope_assertion": ["read_only", "internal_write_only", "no_external_writes"],
  "signature": "ed25519 signature over the message"
}
```

## Transport

v1: HTTPS POST to receiver's registered A2A endpoint. Simple. No persistent connections.

Future: optional MQTT/NATS broker for high-frequency A2A, p2p libp2p for trustless networks.

## Handshake

```
A → B: ping with sender pubkey + intent
B → A: ack | refuse + reason | request-more-info
A → B: handoff envelope
B → A: receipt (immediate) + later response (when complete)
```

## Scope enforcement on the receiver

The receiver's A2A daemon checks every incoming envelope against:
- Sender allowlist
- Scope assertion is within receiver's accepted scope policy
- Payload doesn't request actions outside the configured A2A scope
- Rate limit per sender

Rejections are silent to the network but logged for the receiving user.

## Example use cases

1. **Agency → client handoff**: agency's God Mode instance hands off the client's deliverable + roadmap status to the client's instance. Client's CEO picks up the next phase.
2. **Founder → investor**: founder runs a quarterly update via God Mode; A2A sends the structured update directly to the investor's portfolio-ops pack.
3. **Team coordination**: founder asks God Mode to "delegate this PRD review to my CTO" — A2A routes to the CTO's instance, which processes async and replies.
4. **Multi-org workflow**: GP at a fund A2As due-diligence requests to portfolio companies; replies aggregate back automatically.

## What v1.4 ships

- This spec (the artifact)
- Sample envelope JSON
- Allowlist + scope schema
- A2A daemon STUB at `scripts/a2a-daemon.js` (logs received envelopes, no actual execution yet)

## What v1.5 ships

- Receiver-side: full envelope validation + signature check
- Receiver-side: scope enforcement
- Sender-side: signing + transport
- Round-trip examples between two local instances on the same machine

## What v2.0+ ships

- Reputation / trust history per sender
- Crypto-based scope tokens (capabilities)
- Optional metering for paid A2A interactions
- Cross-vendor compatibility (A2A from a non-God-Mode AI tool that speaks the protocol)

## Anti-patterns

- ❌ Implicit A2A trust ("seems like a real sender")
- ❌ Wide-open scope policies ("accept any work from anyone")
- ❌ Signing payloads with a long-lived key never rotated
- ❌ Routing user PII over A2A without explicit per-exchange consent
- ❌ Using A2A for things that should just be a direct API call (don't over-engineer)

## Security model

- All envelopes signed; receiver rejects unsigned
- Payloads encrypted to receiver pubkey (v1.5)
- Audit log immutable append-only
- Scope assertions cannot be silently widened
- Receiver UI must surface every incoming envelope for human review on first contact with a sender
