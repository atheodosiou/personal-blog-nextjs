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
  nonempty topic archives. Do not restore static copies in `public/`.
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
