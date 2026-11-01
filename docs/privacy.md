# Consent implementation and production checks

Google Analytics is enabled only when `GAID` contains a GA4 measurement ID
(`G-...`) and the first-party `portfolio_consent` cookie has a current accepted
record. Missing, rejected, invalid, expired or obsolete-version choices fail
closed. The cookie stores only version, choice and timestamp; both choices expire
after 180 days. No Google tag or consent-status ping is sent before acceptance.

The tag queues denied defaults, then grants analytics storage before loading
Google's library. Advertising storage/user-data/personalization remain denied;
Google signals and advertising personalization are explicitly disabled.
Analytics cookie expiry is capped at 180 days with automatic renewal disabled.

Withdrawing sets Google's `ga-disable-MEASUREMENT_ID` flag synchronously, clears
accessible GA cookies at host/parent-domain and path scopes, and reloads the
document to dispose of the loaded vendor runtime. Already sent requests/data
cannot be recalled. BroadcastChannel notifies other tabs; focus, visibility and
periodic expiry checks provide fallbacks.

Giscus is activated separately with Load comments. The unused IP/user-agent
fingerprinting view-registration endpoint now returns 410 without a database
connection. Existing historical database records are not deleted by this change.
Review their retention separately; the aggregate views endpoint does not register
new visitors.

## Before production

- Keep the real `GAID` in the existing production environment. Test builds use a
  deliberately fictional ID and intercept Google requests locally.
- Confirm GA4 Admin > Data settings > Data retention. The owner reports unchanged
  defaults, but the exact property value has not been inspected. The public
  policy explains property-controlled retention rather than inventing a value.
  Prefer a defined, justified period and update the policy with the confirmed
  value. Cookie expiry does not determine Google's server-side retention.
- Review linked products, data sharing, enhanced measurement and existing
  connected tags in GA4; the repository cannot inspect or change account settings.
- Confirm server/security log retention on the Contabo VPS and whether Cloudflare
  proxying is enabled. Policies identify the providers without inventing log
  lifetimes, server locations or transfer certifications.
- In a fresh browser: no Google tag/collect request before consent; reject and
  reload; accept and navigate; withdraw and reload; check a second open tab.
- Check storage blocking, expired/malformed consent, keyboard focus/Escape in
  settings, mobile widths, and comments before/after Load comments.

## Regression checks

`npm run check:seo -- http://127.0.0.1:3100` covers policy URLs through the sitemap.
`npm run test:consent` (Node 22.6+) checks consent
record validation. `npm run check:privacy -- http://127.0.0.1:3100` checks initial
HTML, policy links and retirement of the fingerprint endpoint.
Browser/network verification uses the skill's local browser
test harness under `.taste-skill/` (not included in the shipped application).

Official implementation references:

- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/privacy
- https://support.google.com/analytics/answer/11397207
- https://support.google.com/analytics/answer/7667196
