# Compliance modes — detailed spec

The compliance mode is set in `~/.themeetpatel/compliance.json`. The runtime enforces matching constraints. Strictest rule wins when multiple modes are active.

## Mode definitions

### `none` (default)
No additional constraints beyond v1.3 baseline. Audit log present. Local-only storage.

### `gdpr`
- Default retention: 30 days for sessions, 365 days for memory
- Right-to-delete: `god-mode-cli delete-my-data` purges everything for a user
- Data minimization: PII auto-redacted on every external action and ledger write
- Consent tracking: every external action logs a consent reference
- DPA: a Data Processing Agreement template ships at `docs/DPA-GDPR.md`
- Data residency: defaults to EU (configurable)
- Export-on-request: full data export bundled as ZIP on demand

### `hipaa`
- BAA required: refuses external connector setup until a BAA is on file (org-level acknowledgment)
- PHI auto-redaction: strict PII patterns include medical identifiers, MRNs, diagnostic codes
- Audit log retention: 7 years
- Access logs: every read of PHI-flagged memory generates a log entry
- Encryption-at-rest: required (v1.5+)
- Storage region: US (HIPAA-covered cloud) or on-prem
- No third-party LLM without explicit BAA path (limits cross-vendor router to Anthropic Bedrock + on-prem)

### `pci-dss`
- Card-number regex auto-redaction (already in pii-redact.js)
- No card data EVER persisted to memory, ledger, or audit (even hashed)
- Audit log retention: 1 year
- Cardholder data flow markers in any session that touched a payment system

### `uae-pdpl`
- UAE data residency
- Consent tracking on every external action
- Data Subject Access Request (DSAR) workflow
- Cross-border transfer restrictions (no transfer to non-adequate jurisdictions without explicit user opt-in)
- Local Arabic-language data subject communication options

### `soc2-type-ii`
- Audit log integrity hash (Merkle-tree style) for tamper-evident logs
- Quarterly attestation export
- Access control logs include user, time, resource, outcome
- Change management logs for all config changes
- Vendor risk assessment template at `docs/VENDOR-RISK-SOC2.md`

## Mode composition

When multiple modes apply (e.g., `gdpr + soc2`), the runtime applies:
- Strictest retention wins (GDPR's 30-day session retention beats SOC2's 1-year if both apply)
- Strictest PII rules win
- Audit log entries include all applicable mode tags
- Compliance reports cover all active modes

## Setting modes

```bash
# Personal
echo '{"modes": ["gdpr"]}' > ~/.themeetpatel/compliance.json

# Org-level (sets baseline for all users)
echo '{"modes": ["soc2-type-ii", "gdpr"], "enforce": "strict"}' > ~/.themeetpatel-org/compliance.json
```

## What v1.4 ships

- This spec
- compliance.json schema
- Mode-aware PII redactor (already shipped, will be extended per mode)
- Audit-log enrichment with mode tags (basic)

## What v1.5 ships

- Runtime enforcement of retention per mode
- DSAR workflow
- Audit-log integrity hashing

## What v1.6 ships

- Quarterly attestation export
- BAA / DPA template integration
- Cross-vendor restrictions enforcement
- Compliance dashboard
