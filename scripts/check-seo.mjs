import assert from "node:assert/strict";
import { assertStatus, request } from "./lib/http.mjs";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3100").origin;
const canonicalOrigin = "https://anastasios.theodosiou.me";
const decode = (value) => value.replace(/&(amp|quot|apos|lt|gt|#x27|#39);/g,
  (_, entity) => ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", "#x27": "'", "#39": "'" })[entity]);
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]),
);
const links = (html) => [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag));
const meta = (html, key) => [...html.matchAll(/<meta\b[^>]*>/g)]
  .map(([tag]) => attributes(tag)).find((item) => item.name === key || item.property === key)?.content;
const xmlValues = (xml, name) => [...xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([^<]*)</${name}>`, "g"))]
  .map((match) => decode(match[1]));

async function read(path, expectedStatus = 200) {
  const response = await request(new URL(path, origin), {
    redirect: "manual",
  });
  assertStatus(response, expectedStatus, path);
  return { response, body: await response.text() };
}

function checkPage(html, expectedCanonical) {
  const canonical = links(html).filter((link) => link.rel === "canonical");
  assert.equal(canonical.length, 1, `${expectedCanonical}: one canonical`);
  assert.equal(new URL(canonical[0].href).href, expectedCanonical, "Canonical identifies this page");
  assert.equal(new URL(meta(html, "og:url")).href, expectedCanonical, "Open Graph URL agrees");
  assert.ok(meta(html, "description"), "Description exists");
  assert.ok(meta(html, "og:image")?.startsWith(canonicalOrigin), "Public Open Graph image");
  assert.equal(meta(html, "twitter:card"), "summary_large_image");
  assert.ok(!meta(html, "robots")?.includes("noindex"), "Published page remains indexable");
  assert.ok(links(html).some((link) => link.type === "application/rss+xml"), "RSS discovery");
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, "One primary heading");
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => {
      const data = JSON.parse(match[1]);
      return data["@graph"] ?? [data];
    });
  assert.ok(schema.some((item) => item["@type"] === "Person"), "Person identity is server-rendered");
  assert.ok(schema.some((item) => item["@type"] === "WebSite"), "Website identity is server-rendered");
  return schema;
}

const { body: sitemap } = await read("/sitemap.xml");
const urls = xmlValues(sitemap, "loc");
assert.ok(urls.length > 4, "Sitemap contains the content");
assert.equal(new Set(urls).size, urls.length, "No duplicate sitemap URLs");
const images = new Set();
for (const url of urls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, canonicalOrigin);
  const { body } = await read(`${parsed.pathname}${parsed.search}`);
  const schema = checkPage(body, url);
  images.add(meta(body, "og:image"));
  if (parsed.pathname.startsWith("/blog/")) {
    const article = schema.find((item) => item["@type"] === "BlogPosting");
    assert.equal(article?.url, url, "Article schema URL");
    assert.equal(meta(body, "og:image"), article?.image, "Article social image matches its schema");
    assert.ok(article?.author?.url?.endsWith("/about"), "Article author profile");
    assert.ok(Number.isFinite(Date.parse(article?.datePublished)), "Valid publication date");
    assert.ok(Date.parse(article.dateModified) >= Date.parse(article.datePublished), "Modification is not before publication");
    assert.equal(meta(body, "article:published_time"), article.datePublished);
  }
  if (parsed.pathname === "/about") {
    assert.ok(schema.some((item) => item["@type"] === "ProfilePage"), "About profile schema");
  }
}

for (const image of images) {
  const parsed = new URL(image);
  await read(parsed.pathname);
}

for (const path of ["/projects", "/projects/study-workspace", "/projects/xlf-sync"]) {
  assert.ok(urls.includes(`${canonicalOrigin}${path}`), `${path}: project is discoverable in sitemap`);
}
for (const path of ["/tags/angular", "/tags/typescript", "/tags/nestjs", "/tags/i18n"]) {
  const { body } = await read(path);
  assert.ok(urls.includes(`${canonicalOrigin}${path}`));
  assert.ok(body.includes('href="/projects/'), `${path}: guide connects to first-hand work`);
}
const { body: archive } = await read("/tags/aws-certification");
assert.ok(meta(archive, "robots")?.includes("noindex"), "Utility tag archives do not compete with substantive guides");
assert.ok(!urls.includes(`${canonicalOrigin}/tags/aws-certification`));
assert.ok(archive.includes('href="/blog/'), "Utility archives remain useful for browsing");
const legacySitemap = await read("/assets/sitemap.xml", 308);
assert.equal(legacySitemap.response.headers.get("location"), "/sitemap.xml");
const { body: missingProject } = await read("/projects/not-a-real-project", 404);
assert.ok(meta(missingProject, "robots")?.includes("noindex"));

for (const query of ["?page=1", "?page=0", "?page=invalid", "?utm_source=test"]) {
  checkPage((await read(`/blog${query}`)).body, `${canonicalOrigin}/blog`);
}

for (const path of ["/blog/test-article", "/blog/code-blocks", "/blog/not-a-real-post", "/tags/not-a-real-topic"]) {
  assert.ok(!urls.some((url) => new URL(url).pathname === path), "Draft/missing URL excluded");
  const { body } = await read(path, 404);
  assert.ok(meta(body, "robots")?.includes("noindex"), "404 is not indexable");
}

const { body: robots } = await read("/robots.txt");
assert.match(robots, /User-Agent: OAI-SearchBot\s+Allow: \//i);
assert.match(robots, /Sitemap: https:\/\/anastasios\.theodosiou\.me\/sitemap\.xml/);
const { response: feedResponse, body: feed } = await read("/feed.xml");
assert.ok(feedResponse.headers.get("content-type")?.includes("application/rss+xml"));
const articleUrls = urls.filter((url) => new URL(url).pathname.startsWith("/blog/"));
assert.deepEqual(xmlValues(feed, "guid").sort(), articleUrls.sort(), "RSS includes exactly the published articles");
assert.ok(!/test-article|code-blocks/.test(feed), "No draft leakage in RSS");
console.log(`SEO checks passed: ${urls.length} sitemap pages, ${articleUrls.length} articles, ${images.size} social images, pagination, RSS, robots, and draft/404 protection.`);
