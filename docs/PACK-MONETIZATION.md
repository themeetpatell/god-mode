# Pack monetization (v1.6 spec)

How pack authors get paid so the ecosystem becomes self-sustaining.

## Pricing models

| Model | Best for | Notes |
|---|---|---|
| **Free + MIT** | Most packs (matches core's open ethos) | Default; encouraged for general utility |
| **Free + sponsor** | Author-driven, accepts GitHub Sponsors | Optional sponsor button in pack info |
| **One-time license** | Vertical depth (legal, medical, regulated industry) | $X one-time per user, unlock via license key |
| **Subscription** | Continuously-maintained packs (compliance flows, regulatory) | $X/mo per user, expires on subscription cancel |
| **Org seat license** | B2B enterprise packs | Per-seat for org-wide use |
| **Pay-what-you-want** | Indie author packs | Sponsor-style suggested amount |

## Where the money flows

```
User → buys pack license → payment processor → marketplace fee (15-30%) → pack author
                                              ↓
                                       infrastructure costs
                                              ↓
                                       remainder to author
```

Marketplace fee covers:
- Hosting (CDN, registry)
- Payment processing pass-through
- Discovery UI
- Author support
- Fraud / refund handling

## License enforcement

Paid packs include a `license_check` field in pack.json:

```json
{
  "license_check": {
    "endpoint": "https://license.themeetpatel.dev/v1/verify",
    "key_required": true
  }
}
```

The installer calls the endpoint with the user's license key on install + weekly thereafter. If license is invalid/expired, the pack's agents/skills return a "license required" message instead of normal output.

## Anti-DRM rules

The user must be able to:
- Cancel a subscription and keep the data they generated
- Export their session data regardless of pack license status
- Use a free pack as a fallback if a paid pack is unavailable

DRM is for the pack files, not for the user's work.

## Refund policy

- 14-day money-back for one-time licenses
- Pro-rated refund for subscription cancellations within billing period
- No refund after 14 days unless a critical bug is reported

## Author payouts

- Monthly via Stripe / Wise / bank transfer (region-dependent)
- $50 minimum payout threshold
- 1099 / W-8BEN for US tax purposes (US authors)
- VAT / VAT-equivalent handled by marketplace for EU/UK/UAE

## Anti-patterns

- ❌ Free pack that suddenly goes paid (breaks user trust)
- ❌ Paid pack that requires phone-home for every invocation (privacy + offline)
- ❌ License check that blocks any work, even free fallback
- ❌ Marketplace fee > 30% (kills indie author motivation)
- ❌ Author payouts withheld arbitrarily

## Suggested first paid packs

These would benefit most from a paid model:
- **pack-uae-vat-compliance**: e-invoicing flows, FTA registration, return filing automation
- **pack-saas-finance-stack**: revenue recognition, deferred revenue, ASC 606 helpers
- **pack-medical-soap-notes**: HIPAA-compliant clinical workflow
- **pack-legal-contracts**: contract templates with jurisdiction-specific clauses
- **pack-investor-portfolio-ops**: deal flow + portfolio scorecard automation
- **pack-construction-ops**: industry-specific RFI / change order flows

## What v1.4 ships

- This spec
- Pack.json `license_check` field reserved
- Refund + payout policy

## What v1.6 ships

- License verification endpoint
- Stripe integration for purchases
- Author dashboard for revenue
- Tax handling

## Why this matters

A marketplace without monetization is a hobby. A marketplace with extractive monetization is a roadblock. The mix above keeps free packs dominant while letting niche/depth packs be sustainable for their authors.
