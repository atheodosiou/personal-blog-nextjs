# Portfolio measurement

GA4 is optional and starts only after a valid, persisted acceptance. No business
event is queued before consent or replayed when someone later accepts. Withdrawal
and expiry block collection. The single delegated listener also handles client
navigation, keyboard activation and middle clicks without blocking navigation.

## Events and interpretation

| Event | Owner | Meaning |
| --- | --- | --- |
| `page_view` | GA4 / Enhanced Measurement | Initial page load and browser-history navigation |
| `scroll` | GA4 Enhanced Measurement | First reach of approximately 90% vertical depth on a page, not all reading |
| `click` | GA4 Enhanced Measurement | Generic outbound link activation |
| `file_download` | GA4 Enhanced Measurement | Activation of a file link, including the résumé PDF, not a confirmed completed download |
| `contact_click` | Application | Activation of this portfolio's email or WhatsApp link |
| `project_click` | Application | Activation of an allowlisted demo, repository, docs, npm or local case-study link |

Enhanced Measurement owns file downloads. Do not add another manual
`file_download` handler. An outbound project link can produce the generic `click`
and the more specific `project_click`; they measure different things and must
not be summed as two visitor actions. A click is not a delivered contact message
or a confirmed lead. There is no form backend and no `generate_lead` event.

Business event parameters are fixed labels only:

- `contact_method`: `email` or `whatsapp`.
- `project_id`: the authored project identifier.
- `destination`: `demo`, `source`, `api_source`, `docs`, `package` or `case_study`.
- `link_position`: `header`, `content` or `footer`.

`lib/analytics-events.ts` matches exact destinations and discards query strings,
fragments, contact addresses, phone numbers and arbitrary link text. Register
these parameters as event-scoped custom dimensions in GA4 to use them in reports.
Automatic Google events still have Google's standard parameters; they are not
the same as these minimized application events.

## Google configuration

On 2026-11-01 the existing portfolio stream was verified and configured:

- HTTPS stream URL matches the portfolio.
- Page views include browser-history events for Next.js navigation.
- Scrolls, outbound clicks and file downloads were enabled and saved.
- Site search, form interactions and video tracking remain off because the site
  does not currently use those features.
- Search Console was linked to the matching HTTPS portfolio property.
- A User behavior Reports snapshot was selected and saved. The Search Console
  Queries and Google organic search traffic reports are visible in navigation.
- `contact_click` and `file_download` are intent key events, counted once per
  session, without a default monetary value. Raw Event count still counts each
  event. Do not interpret key-event counts as contracts, messages or revenue.
- The four event-scoped dimensions were created and verified: Contact method
  (`contact_method`), Project (`project_id`), Project destination (`destination`)
  and Link position (`link_position`). Legacy Event Category / Event Label
  definitions were preserved.
- Email data redaction was enabled. URL query redaction covers `email`,
  `email_address`, `phone`, `phone_number`, `firstname`, `lastname`, `name`,
  `message`, `token`, `access_token`, `refresh_token`, `password` and `code`.
  UTM parameters were not redacted. Google's matching is best effort, not a
  substitute for keeping personal data out of event payloads.

Google signals and advertising personalization remain disabled. Event retention
is 2 months and user retention is 14 months, with reset on new activity. These
were not silently extended; the privacy policy describes the actual settings.
An internal-traffic exclusion needs an owner-supplied stable public IP and should
be tested before activation. Do not infer an IP from a server address or exclude
an entire ISP. Never put private IP notes or account credentials in this file.
The owner confirmed they do not have a known stable public IP; no internal-traffic
exclusion was activated.

## Reports and campaign links

Use Traffic acquisition for source/medium and key-event rates, Landing page for
entry pages and engagement, Events for `contact_click` / `project_click`, and the
Search Console collection for queries and organic landing-page performance.
Search queries cannot be joined to individual leads or visitors. GA4 data covers
consenting visitors and can also be affected by browser blocking.

For links you publish externally, use consistent non-personal UTM values, e.g.
`?utm_source=linkedin&utm_medium=social&utm_campaign=study_workspace_launch`.
Use the clean canonical URL when linking between portfolio pages. Do not add UTM
parameters to internal navigation or put names/email addresses in campaigns.

Inspect Realtime after acceptance and use DebugView with an explicitly enabled
debug session for event verification. Normal reports and new custom dimensions
need processing time and do not backfill missing pre-consent data.

## Verification and release

Run `npm run test:analytics`, `npm run test:consent`, lint and a production build.
Run `check:seo` and `check:privacy` against the release preview. Browser regression
checks must intercept Google requests locally with a test Measurement ID so
fixture activity cannot pollute the real property. Verify accepted contact and
project clicks once more after production deployment, including GA4 Realtime.

## Validation status of this revision

Lint, TypeScript and the final production build passed. Four consent/classifier
unit tests passed. SEO and privacy HTTP checks passed on the first preview:
21 sitemap pages, 6 articles, 7 social images, project routes, curated guides,
utility-archive noindex, the legacy sitemap redirect and draft/404 protection.
An isolated browser regression passed contact/project events, middle clicks,
no collection before consent, withdrawal, working XLIFF comparison and layouts
at 1440/768/390/320px. Google requests were fulfilled locally with a test ID.

After adding the real product-detail images, the owner reran the HTTP, consent
and interaction checks successfully. Both case studies passed their three-width
inspectors, with only the functional consent-overlay exception. The projects
index uses a restrained intro entrance and individual project text reveals, with
a reduced-motion fallback. The owner rebuilt and reran SEO checks successfully;
the corrected index inspector passed at 1440/768/390 with zero failures and nine
moving elements. Its screenshots and both case-study screenshots were reviewed.
The final build includes the SeaSkills name, URL, supplied landing image and
event destination. SEO/privacy HTTP checks and the isolated interaction suite
passed again on that exact build, including the SeaSkills click, loaded image,
desktop/mobile fit and absence of links to the old domain. Public performance
still needs re-measurement after deployment.

Official reference for data redaction:
https://support.google.com/analytics/answer/13544947
