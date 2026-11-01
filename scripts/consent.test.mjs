import test from "node:test";
import assert from "node:assert/strict";
import { parseConsent, CONSENT_VERSION, CONSENT_MAX_AGE } from "../lib/consent.ts";

const now = Date.UTC(2026, 10, 1);
const encode = (overrides = {}) => encodeURIComponent(JSON.stringify({
  version: CONSENT_VERSION, choice: "accepted", savedAt: now, ...overrides,
}));

test("accept and reject persist for the same bounded period", () => {
  for (const choice of ["accepted", "rejected"]) {
    assert.equal(parseConsent(encode({ choice }), now).choice, choice);
    assert.equal(parseConsent(encode({ choice }), now + CONSENT_MAX_AGE * 1000 - 1).choice, choice);
    assert.equal(parseConsent(encode({ choice }), now + CONSENT_MAX_AGE * 1000), null);
  }
});

test("missing, malformed, obsolete and future records fail closed", () => {
  for (const value of [undefined, "", "%", "not-json", "null", "[]", "{}",
    encode({ version: 0 }), encode({ version: CONSENT_VERSION + 1 }), encode({ choice: "yes" }), encode({ savedAt: "today" }),
    encode({ savedAt: now + 1 }), encode({ savedAt: null })]) {
    assert.equal(parseConsent(value, now), null, String(value));
  }
});
