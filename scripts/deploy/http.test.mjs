import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { checkUserAgent, request, assertStatus } from "../lib/http.mjs";

test("HTTP checks identify themselves honestly and preserve request method/body", async () => {
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    res.writeHead(410, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ userAgent: req.headers["user-agent"], method: req.method, body }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const response = await request(`http://127.0.0.1:${server.address().port}/`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: '{"test":true}',
    });
    assertStatus(response, 410, "retired test endpoint");
    assert.deepEqual(await response.json(), {
      userAgent: checkUserAgent, method: "POST", body: '{"test":true}',
    });
    assert.ok(!checkUserAgent.includes("OAI-SearchBot"));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("a challenged response fails with useful edge diagnostics and never becomes a pass", () => {
  const response = new Response("private-body-must-not-be-logged", { status: 403, headers: {
    server: "cloudflare", "cf-mitigated": "challenge", "cf-ray": "fixture-ray",
  } });
  assert.throws(() => assertStatus(response, 200, "/sitemap.xml"), (error) => {
    assert.match(error.message, /403/);
    assert.match(error.message, /cf-mitigated.*challenge/);
    assert.match(error.message, /fixture-ray/);
    assert.ok(!error.message.includes("private-body"));
    return true;
  });
});
