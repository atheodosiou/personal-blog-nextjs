"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { clearAnalyticsCookies, parseConsent, readConsent, readConsentCookieValue, saveConsent, type ConsentChoice, type ConsentRecord } from "@/lib/consent";
import { setAnalyticsDisabled, startAnalytics, stopAnalytics } from "@/lib/analytics";

const ConsentContext = createContext({ openSettings: () => {} });

function getConsentSnapshot() {
  const value = readConsentCookieValue();
  return parseConsent(value) ? value! : "";
}

export function CookieSettingsButton() {
  const { openSettings } = useContext(ConsentContext);
  return <button type="button" className="cookie-settings-link" onClick={openSettings}>Cookie settings</button>;
}

export function CookieConsentProvider({ children, gaId }: {
  children: React.ReactNode;
  gaId?: string;
}) {
  const analyticsId = gaId && /^G-[A-Z0-9]+$/i.test(gaId) ? gaId : null;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const loaded = useRef(false);
  const channel = useRef<BroadcastChannel | null>(null);

  const apply = useCallback((next: ConsentRecord | null) => {
    if (analyticsId && next?.choice === "accepted") {
      startAnalytics(analyticsId);
      loaded.current = true;
    } else {
      if (analyticsId) stopAnalytics(analyticsId);
      else clearAnalyticsCookies();
      // Unmounting a script cannot remove the vendor's event listeners. A reload
      // disposes of the loaded runtime after the opt-out flag has blocked it.
      if (loaded.current) location.reload();
    }
  }, [analyticsId]);

  const subscribe = useCallback((notify: () => void) => {
    const refresh = () => {
      apply(readConsent());
      notify();
    };
    try {
      channel.current = new BroadcastChannel("portfolio-cookie-consent");
      channel.current.onmessage = refresh;
    } catch { /* Focus/expiry checks still work when BroadcastChannel is blocked. */ }
    window.addEventListener("focus", refresh);
    window.addEventListener("portfolio-cookie-consent", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      channel.current?.close();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("portfolio-cookie-consent", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.clearInterval(timer);
    };
  }, [apply]);

  const snapshot = useSyncExternalStore<string | null>(subscribe, getConsentSnapshot, () => null);
  const ready = snapshot !== null;
  const record = parseConsent(snapshot ?? undefined);

  useEffect(() => {
    if (!ready) return;
    if (analyticsId) setAnalyticsDisabled(analyticsId, true);
    apply(readConsent());
  }, [analyticsId, apply, ready, snapshot]);

  useEffect(() => {
    if (settingsOpen) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [settingsOpen]);

  function choose(choice: ConsentChoice) {
    const next = saveConsent(choice);
    setSettingsOpen(false);
    channel.current?.postMessage("updated");
    // Cookie-blocking browsers must not enable measurement on an unpersisted grant.
    apply(choice === "accepted" ? readConsent() : next);
    window.dispatchEvent(new Event("portfolio-cookie-consent"));
  }

  const actions = (
    <div className="cookie-actions">
      <button type="button" className="cookie-action" onClick={() => choose("accepted")}>Accept analytics</button>
      <button type="button" className="cookie-action" onClick={() => choose("rejected")}>Reject analytics</button>
    </div>
  );

  return (
    <ConsentContext.Provider value={{ openSettings: () => setSettingsOpen(true) }}>
      {children}
      {ready && analyticsId && !record && !settingsOpen && (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title" data-ui>
          <h2 id="cookie-banner-title">Your privacy, your choice.</h2>
          <p>With your permission, I use Google Analytics to understand how this site is used. Analytics stays off until you accept. You can change your choice at any time.</p>
          {actions}
          <div className="cookie-policy-links"><Link href="/cookies">Cookie policy</Link><Link href="/privacy">Privacy policy</Link></div>
        </section>
      )}
      <dialog ref={dialog} className="cookie-dialog" aria-labelledby="cookie-settings-title" onCancel={() => setSettingsOpen(false)} onClose={() => setSettingsOpen(false)} data-ui>
        <div className="cookie-dialog-heading">
          <h2 id="cookie-settings-title">Cookie settings</h2>
          <button type="button" className="text-link" onClick={() => setSettingsOpen(false)}>Close</button>
        </div>
        <h3>Essential preferences</h3>
        <p>The site remembers your privacy choice and your selected colour theme. These preferences are separate from analytics.</p>
        <h3>Google Analytics</h3>
        <p>{!analyticsId ? "Analytics is not configured on this site." : record?.choice === "accepted" ? "Analytics is currently on. Reject analytics to withdraw your consent. This removes analytics cookies and reloads the page." : "Analytics is currently off. Accept only if you want to allow optional audience measurement."}</p>
        {analyticsId && actions}
        <div className="cookie-policy-links"><Link href="/cookies" onClick={() => setSettingsOpen(false)}>Cookie policy</Link><Link href="/privacy" onClick={() => setSettingsOpen(false)}>Privacy policy</Link></div>
      </dialog>
    </ConsentContext.Provider>
  );
}
