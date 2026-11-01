export const CONSENT_COOKIE = "portfolio_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60;

export type ConsentChoice = "accepted" | "rejected";
export type ConsentRecord = {
  version: number;
  choice: ConsentChoice;
  savedAt: number;
};

export function parseConsent(value: string | undefined, now = Date.now()): ConsentRecord | null {
  if (!value) return null;
  try {
    const record = JSON.parse(decodeURIComponent(value));
    if (
      record.version !== CONSENT_VERSION ||
      !["accepted", "rejected"].includes(record.choice) ||
      !Number.isFinite(record.savedAt) ||
      record.savedAt > now ||
      now - record.savedAt >= CONSENT_MAX_AGE * 1000
    ) return null;
    return record;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentRecord | null {
  const value = document.cookie.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  return parseConsent(value);
}

export function saveConsent(choice: ConsentChoice): ConsentRecord {
  const record = { version: CONSENT_VERSION, choice, savedAt: Date.now() };
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  return record;
}

export function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((part) => part.trim().split("=")[0])
    .filter((name) => /^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name));
  const hostname = location.hostname;
  const domains = new Set(["", hostname]);
  const labels = hostname.split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    const domain = labels.slice(i).join(".");
    domains.add(domain);
    domains.add(`.${domain}`);
  }
  const paths = new Set(["/"]);
  const segments = location.pathname.split("/").filter(Boolean);
  for (let i = 1; i <= segments.length; i++) {
    const path = `/${segments.slice(0, i).join("/")}`;
    paths.add(path);
    paths.add(`${path}/`);
  }
  for (const name of names) for (const domain of Array.from(domains)) for (const path of Array.from(paths)) {
    document.cookie = `${name}=; Max-Age=0; Path=${path}${domain ? `; Domain=${domain}` : ""}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
}
