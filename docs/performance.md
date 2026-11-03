# Lighthouse performance work

## Image optimization — 2026-11-02

Implemented on `rebranding-2026`, starting from `bf96f87`.

The homepage's five project images now declare sizes that follow the actual
`.shell` gutters, grid breakpoints, column proportions and maximum width in
`app/globals.css`. The three featured images share one sizes definition; the
two supporting cards share another. Keep these definitions aligned with future
layout changes.

Study Workspace and Availo use quality 75 instead of 90. Study Workspace retains
eager loading and high fetch priority because it is the mobile LCP image.
The browser still chooses higher resolution candidates on high-density screens.

### Measurement method

Compared production builds on the same local server using Lighthouse 13.6.0,
Chrome with fresh profiles and extensions disabled, the standard mobile profile
and the desktop preset. Each profile ran three times per build; values below
are medians. The baseline and final builds used the same dependency lockfile.
The browser cache was cold for each Lighthouse run; the Next.js image cache
was warmed during browser verification.

These runs had no prior analytics consent and no Cloudflare edge injection.
They isolate application changes. They are not directly comparable to the
original production Lighthouse 13.5.0 reports, which included extensions,
Cloudflare scripts and Google Analytics.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 93 | 94 | 100 | 100 |
| Image transfer, bytes | 111,075 | 88,839 | 133,596 | 80,367 |
| Image transfer reduction | — | 20.0% | — | 39.8% |
| LCP | 3.21 s | 3.11 s | 0.25 s | 0.25 s |

Timing and score differences are small relative to run variability. The reliable
gain is lower image transfer. Mobile LCP remains above the 2.5-second target.

### Verification

- Production build, including TypeScript, and ESLint passed.
- SEO HTTP checks passed: 21 sitemap pages, articles, social images, RSS,
  pagination, redirects, and draft/404 protection.
- Privacy HTTP checks passed.
- Browser checks passed at 1440, 768 and 390 CSS pixels: all five project images
  loaded, no horizontal overflow and no uncaught JavaScript exceptions.
- Visual inspection passed at all three widths. The existing layout inspector
  reported zero failures before and after; its three advisory findings were
  unchanged. Image compression softens fine screenshot text slightly.

Raw Lighthouse JSON, summaries, browser results and screenshots are saved locally
under `.taste-skill/performance/` (ignored by Git).

### Repeat after deployment

Run at least three mobile and three desktop audits against the same deployed
revision, with extensions disabled and a consistent consent state. Measure a
fresh visit and a visit with accepted analytics separately. Also check a project
case study and a blog article; homepage scores do not cover other templates.

For a repeatable CLI run, use a fixed Lighthouse version, for example:

```powershell
npx --yes lighthouse@13.6.0 https://anastasios.theodosiou.me/ --only-categories=performance --chrome-flags="--headless=new --disable-extensions" --output=json --output-path=mobile.json
```

Add `--preset=desktop` and choose another output filename for desktop runs.
Keep the same Lighthouse version and profile when comparing revisions.

### Diagnostics before bundle optimization

The clean image-only baseline flagged roughly 72 KiB of unused first-party
JavaScript across three chunks. These include React/Next.js runtime code and
the shared Radix dialog/dropdown code. The following pass addresses the menu
code. Do not assume the unused portion of framework code can all be removed.

The original production Best Practices score of 81 comes from deprecated APIs
in Cloudflare's injected challenge script. This is an edge configuration/vendor
issue and remains outside this application change.

## Header JavaScript optimization — 2026-11-02

Webpack module stats identified the shared Radix dialog/dropdown chunk as a
controllable initial cost: 32,309 gzip bytes, plus supporting utilities. There
were no Framer Motion modules in the client compilation, so removing its package
would not reduce the current download.

`HeaderControls` now renders lightweight, server-rendered buttons. The existing
Radix menu and drawer load through a dynamic import when the visitor opens a
control. Pointer entry or keyboard focus prewarms the import. The first click or
keypress opens the requested control once the code arrives; a second activation
is not required. Both controls stay mounted after that first use.

The initial triggers use the same markup/styles as the interactive controls.
Keyboard activation of the theme menu focuses its first item, including the
first activation before Radix's keyboard listener exists. Loading is announced
to assistive technology; Escape or leaving focus cancels a pending open. A
failed load leaves the buttons available for retry. On a slow connection, the
first menu activation can wait for its code to download.

### Results

Compared with the image-only version above, using the same Lighthouse 13.6.0
profiles and three runs per device:

| Metric | Before | After |
| --- | ---: | ---: |
| Modern initial script files, gzip | 193,032 bytes | 152,546 bytes |
| Initial script reduction | — | 21.0% (39.5 KiB) |
| Mobile total transfer, median | 382,904 bytes | 341,379 bytes |
| Mobile Performance, median | 94 | 95 |
| Mobile LCP, median | 3.11 s | 2.90 s |
| Mobile TBT, median | 28.5 ms | 32.5 ms |
| Desktop Performance, median | 100 | 100 |

Initial script sizes are sums of gzip-compressed files referenced by the
homepage HTML, excluding the `nomodule` polyfill script. Network totals include
request overhead and resources other than JavaScript. The saved menu code is
deferred, rather than removed from visits that use a menu. Browser request logs
confirmed that the Radix chunk is absent on initial load and appears on intent.
Raw stats and checks are in `.taste-skill/performance/bundle-before/` and
`bundle-after/`; the image-only Lighthouse baseline is in `after/`.

The stable result is the smaller initial download. Timing differences remain
subject to local run variability, and mobile LCP still exceeds 2.5 seconds.
Repeat against production with consistent consent state before attributing a
real-user speed change to this pass.

### Verification

- Production build/TypeScript and ESLint passed.
- SEO and privacy HTTP checks passed.
- Real browser tests passed cold and warm activation, keyboard item focus,
  light/dark selection, focus restoration, Escape, outside click, mobile focus
  trapping, client navigation and reopening the drawer after navigation.
- Delaying the Radix request verified the loading state, Escape cancellation
  and successful retry.
- Lighthouse Accessibility, Best Practices and SEO were all 100 in the clean
  local preview. These do not include Cloudflare's production scripts.
- The layout inspector passed at 1440, 768 and 390 pixels with zero failures
  and the same three advisory findings as before the header change.

### Repeat bundle analysis

The optional webpack stats plugin uses no additional dependency and only writes
analysis when explicitly enabled:

```powershell
$env:NEXT_BUILD_DIR = ".next-build"
$env:ANALYZE_CLIENT_BUNDLE = "1"
npm run build
Remove-Item Env:ANALYZE_CLIENT_BUNDLE
```

Read `.next-build/analyze/client.json` for module/chunk membership. Nested module
sizes are uncompressed and can overlap parent concatenated modules; do not add
both. Use emitted asset compression or browser transfer data for payload sizes.
