import { clearAnalyticsCookies, CONSENT_MAX_AGE, readConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function setAnalyticsDisabled(gaId: string, disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = disabled;
}

export function startAnalytics(gaId: string) {
  if (readConsent()?.choice !== "accepted") return;
  setAnalyticsDisabled(gaId, false);
  if (document.getElementById("portfolio-google-analytics")) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function () {
    // Fail closed when consent expires or is removed in another tab.
    if (readConsent()?.choice === "accepted") window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", gaId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: CONSENT_MAX_AGE,
    cookie_update: false,
    cookie_domain: location.hostname,
  });
  const script = document.createElement("script");
  script.id = "portfolio-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);
}

export function stopAnalytics(gaId: string) {
  // Do not send a consent-denied ping: block collection before clearing storage.
  setAnalyticsDisabled(gaId, true);
  document.getElementById("portfolio-google-analytics")?.remove();
  window.gtag = () => {};
  window.dataLayer = [];
  clearAnalyticsCookies();
}
