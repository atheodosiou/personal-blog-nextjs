# Search and AI discovery

The public origin is `https://anastasios.theodosiou.me`. Canonical URLs and
structured-data IDs always use that origin, including during local testing.
`lib/seo.ts` owns the shared metadata and Person/WebSite identities.

## Content publishing

- Publish articles through `content/blog/*.mdx` with `published: true`. Drafts
  return 404 and are excluded from the sitemap and RSS feed.
- Keep `date` as the original publication date. Add `updated: YYYY-MM-DD` only
  after a meaningful article revision. It supplies the article's modification
  metadata, structured data, sitemap timestamp, and RSS channel update date.
- Update the explicit home/About revision dates in `app/sitemap.ts` after a
  significant profile revision. Never replace dates with the current build time.
- The sitemap automatically includes published articles, blog pagination, and
  the projects and curated topic guides. Utility tag archives remain available
  with `noindex, follow`, and are excluded from the sitemap. Do not restore
  static copies in `public/`.
- The five current search landing pages are Angular, TypeScript, NestJS,
  frontend architecture and internationalization (`config/topics.ts`). Each
  contains an authored introduction, relevant articles and a real project link.
  The 21 sitemap URLs are intentional; the previous 53 included many utility
  archives. These archives are not deleted or blocked in robots.txt.
- `/projects`, `/projects/study-workspace` and `/projects/xlf-sync` connect
  the homepage, related articles, topic guides and author profile. Case studies
  have dedicated metadata, product images, breadcrumbs and WebPage /
  SoftwareSourceCode structured data. The index uses CollectionPage / ItemList.
- `/assets/sitemap.xml` permanently redirects to `/sitemap.xml` so old
  submissions and crawler references have a valid destination after deployment.
- Metadata, schema, and visible content must agree. Do not add fictional
  credentials, testimonials, client relationships, ratings, or user statistics.
- When syndicating an article on DEV, use its canonical URL setting to identify
  the original article here. This repository cannot change DEV account settings.

## Production verification

1. Deploy this branch through the existing production process. A push alone
   does not establish that production is running this revision.
2. Run `npm run check:seo -- https://anastasios.theodosiou.me` after deployment.
   During local production testing, supply the local server origin instead.
3. Verify the existing Google Search Console property, submit `/sitemap.xml`,
   and inspect the home, About, and newest article URLs. A verification meta tag
   already exists; it does not prove the property is currently verified.
4. Validate an article and About page with Google's Rich Results Test. Check
   mobile PageSpeed Insights and Search Console's Core Web Vitals report.
5. Review indexing, impressions, queries, clicks, and CTR in Search Console.
   Compare periods after recrawling; do not infer ranking from a Lighthouse score.
6. Check any reverse proxy/CDN/WAF separately: it must serve real HTML to search
   crawlers without login, a bot challenge, or a blanket bot block.

## Google account work on 2026-11-01

The existing HTTPS URL-prefix property was accessible in Search Console. The
production sitemap was resubmitted successfully and Google read its then-current
53 URLs. The home and About pages were already indexed. A live test of the home
returned "URL is available to Google". Indexing requests for home and About were
accepted. The newest article was discovered but not indexed at inspection time;
its indexing request was accepted as well. Requests do not establish indexing.

The GA4 web stream was linked successfully to the matching HTTPS Search Console
property. The new case studies and revised 21-URL sitemap still require a new
code deployment, then public checks and resubmission. Do not request indexing of
the case-study URLs while they still return 404 on production.
Search Console's mobile and desktop Core Web Vitals reports both showed
insufficient usage data over the last 90 days. A lab run does not replace that
missing real-user evidence.

## Performance baseline

One mobile Lighthouse run on the current public release on 2026-11-01 measured
performance 92, accessibility 100, best practices 81 and SEO 100. Lab LCP was
3.3s, TBT 80ms and CLS 0.03. The first Study Workspace image was identified as
the LCP element and was lazy-loaded. This change makes that image eager with
high fetch priority. Re-measure the deployed release; do not present a local
measurement as a verified improvement on the VPS.

Best-practices deprecation warnings came from Cloudflare's injected challenge
script. Cloudflare also injected a Web Analytics beacon and email-decode script.
Those dashboard-controlled scripts are outside this repository. Do not disable
bot/security protection merely to improve a Lighthouse score. Review the
separate Web Analytics configuration and disclosure with the site owner.

Google PageSpeed's unauthenticated API returned 429; the baseline above is from
the official Lighthouse CLI in a fresh headless Chrome, not PageSpeed field data.

## AI discovery

`robots.ts` permits search crawlers, explicitly including OpenAI's OAI-SearchBot.
GPTBot training permission is a separate control; its previous wildcard policy
is preserved. Search access makes content eligible for discovery, not guaranteed
to be cited or recommended.

The site exposes server-rendered text, crawlable internal links, consistent
Person/profile identities and social links, article authorship, and RSS. There
is no special AI schema or hidden instruction to recommend the author. Google's
AI Search features do not require `llms.txt` or other AI text files.

The next content investment should be first-hand case studies: the actual
problem, personal contribution, technical decisions and tradeoffs, tests,
deployment, source/demo links, and verified results. Keep LinkedIn, GitHub, DEV,
and the downloadable CV consistent with the public profile.

Official references:

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.openai.com/api/docs/bots
