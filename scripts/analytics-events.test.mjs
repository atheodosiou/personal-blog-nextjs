import test from "node:test";
import assert from "node:assert/strict";
import { getPortfolioEvent } from "../lib/analytics-events.ts";

const origin = "https://anastasios.theodosiou.me";
const contact = { email: "owner@example.com", whatsapp: "https://wa.me/123456789" };
const classify = (href) => getPortfolioEvent(href, origin, contact);

test("contact events contain only the method, never destination or message data", () => {
  assert.deepEqual(classify("mailto:owner@example.com?body=private-message"), {
    name: "contact_click", parameters: { contact_method: "email" },
  });
  assert.deepEqual(classify("https://wa.me/123456789?text=private-message"), {
    name: "contact_click", parameters: { contact_method: "whatsapp" },
  });
  assert.equal(classify("mailto:someone-else@example.com"), null);
  assert.equal(classify("https://wa.me/99999"), null);
});

test("project classification accepts exact destinations and omits arbitrary URL data", () => {
  assert.deepEqual(classify("https://github.com/atheodosiou/study-workplace?token=private#secret"), {
    name: "project_click", parameters: { project_id: "study-workspace", destination: "source" },
  });
  assert.deepEqual(classify("https://www.npmjs.com/package/xlf-sync/"), {
    name: "project_click", parameters: { project_id: "xlf-sync", destination: "package" },
  });
  assert.deepEqual(classify("/projects/xlf-sync?email=private"), {
    name: "project_click", parameters: { project_id: "xlf-sync", destination: "case_study" },
  });
  assert.deepEqual(classify("https://seaskills.org/?utm_source=portfolio"), {
    name: "project_click", parameters: { project_id: "seaskills", destination: "demo" },
  });
  assert.equal(classify("https://seaskills.org.evil.example/"), null);
  for (const href of ["javascript:alert(1)", "https://study.theodosiou.me.evil.example/", "https://github.com/atheodosiou/study-workplace-other", "/about", "/projects/unknown", "/Anastasios_Theodosiou_Senior_Frontend_Engineer_2025.pdf"]) {
    assert.equal(classify(href), null, href);
  }
});
