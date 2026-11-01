import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3201").origin;
const get = async (path) => {
  const response = await fetch(new URL(path, origin), {
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response;
};

const html = await (await get("/")).text();
const gaId = process.env.GAID;
assert.match(gaId ?? "", /^G-[A-Z0-9]+$/, "A verified GAID is required for deployment checks");
assert.ok(html.includes(gaId), "Homepage has the intended GA4 configuration");
for (const [path, file] of [
  ["/favicon.ico", "../app/favicon.ico"],
  ["/icon.svg", "../app/icon.svg"],
  ["/apple-icon.png", "../app/apple-icon.png"],
  ["/icon-192.png", "../public/icon-192.png"],
  ["/icon-512.png", "../public/icon-512.png"],
]) {
  const actual = Buffer.from(await (await get(path)).arrayBuffer());
  const expected = await readFile(new URL(file, import.meta.url));
  assert.ok(actual.equals(expected), `${path}: matches this release`);
}
const manifest = await (await get("/manifest.webmanifest")).json();
assert.equal(manifest.name, "Anastasios Theodosiou");
assert.equal(manifest.icons.length, 2);
console.log("Deployment checks passed: GA4 configuration, manifest and exact release icons.");
