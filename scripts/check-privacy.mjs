import assert from "node:assert/strict";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3100").origin;
for (const path of ["/", "/about", "/projects/study-workspace", "/projects/xlf-sync", "/cookies", "/privacy", "/blog/building-study-workspace-certification-practice-app"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path}: HTTP status`);
  const html = await response.text();
  assert.ok(!/<script\b[^>]*src=["'][^"']*(?:googletagmanager|google-analytics)/i.test(html), `${path}: no Google tag in initial HTML`);
  assert.ok(!/<iframe\b[^>]*src=["'][^"']*giscus\.app/i.test(html), `${path}: no third-party comments before activation`);
  assert.ok(html.includes('href="/cookies"') && html.includes('href="/privacy"'), `${path}: policy links available without JavaScript`);
}
const retired = await fetch(new URL("/api/blog/privacy-test/registerView", origin));
assert.equal(retired.status, 410, "Legacy fingerprint registration is retired");
assert.equal(retired.headers.get("cache-control"), "no-store");
assert.deepEqual(await retired.json(), { error: "View registration has been retired." });
const retiredPost = await fetch(new URL("/api/blog/privacy-test/views", origin), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ uniqueVisitorId: "privacy-regression-test" }),
});
assert.equal(retiredPost.status, 410, "The second legacy writer cannot register visitors either");
assert.deepEqual(await retiredPost.json(), { error: "View registration has been retired." });
console.log("Privacy HTTP checks passed: no initial Google tag/Giscus iframe, policy links present, fingerprint endpoint retired.");
