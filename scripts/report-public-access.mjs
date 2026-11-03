import { checkUserAgent, request } from "./lib/http.mjs";

// Diagnostics only: the production verification step remains a strict gate.
// Comparing our honest identity with the old simulated crawler identifies
// edge rules that treat a GitHub runner differently from a local connection.
for (const userAgent of [checkUserAgent, "OAI-SearchBot/1.4", "node"]) {
  try {
    const response = await request("https://anastasios.theodosiou.me/sitemap.xml", {
      headers: { "User-Agent": userAgent }, redirect: "manual",
    });
    console.log(JSON.stringify({
      userAgent, status: response.status,
      server: response.headers.get("server"),
      mitigation: response.headers.get("cf-mitigated"),
      ray: response.headers.get("cf-ray"),
      contentType: response.headers.get("content-type"),
    }));
    await response.body?.cancel();
  } catch (error) {
    console.log(JSON.stringify({ userAgent, error: error.message }));
  }
}
