import { siteConfig } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-static";

export function GET() {
  const published = getPublishedPosts();
  const latestUpdate = published
    .map((post) => post.updated ?? post.date).sort().at(-1);
  const items = published.map((post) => {
    const url = escapeXml(absoluteUrl(`/blog/${post.slugAsParams}`));
    return `<item>
      <title>${escapeXml(post.title.replace(/`/g, ""))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description ?? "")}</description>
      <dc:creator>${escapeXml(post.author ?? siteConfig.author)}</dc:creator>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("") ?? ""}
    </item>`;
  }).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Engineering Writing</title>
    <link>${escapeXml(absoluteUrl("/blog"))}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
    ${latestUpdate ? `<lastBuildDate>${new Date(latestUpdate).toUTCString()}</lastBuildDate>` : ""}
    ${items}
  </channel>
</rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
