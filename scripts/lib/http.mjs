import assert from "node:assert/strict";

// These checks are the site's own monitor, not an OpenAI/search crawler.
export const checkUserAgent = "PortfolioDeploymentCheck/1.0 (+https://anastasios.theodosiou.me)";

export function request(url, options = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("User-Agent")) headers.set("User-Agent", checkUserAgent);
  return fetch(url, {
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(20_000),
  });
}

export function assertStatus(response, expected, label) {
  const edge = ["server", "cf-mitigated", "cf-ray", "content-type"]
    .map((name) => [name, response.headers.get(name)])
    .filter(([, value]) => value !== null);
  assert.equal(response.status, expected,
    `${label}: HTTP status; response headers ${JSON.stringify(Object.fromEntries(edge))}`);
}
