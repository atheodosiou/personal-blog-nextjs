"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { readConsent } from "@/lib/consent";
import { getPortfolioEvent } from "@/lib/analytics-events";

export function AnalyticsInteractions({ gaId }: { gaId?: string }) {
  useEffect(() => {
    if (!gaId || !/^G-[A-Z0-9]+$/i.test(gaId)) return;
    const track = (event: MouseEvent) => {
      if (event.type === "click" ? event.button !== 0 : event.button !== 1)
        return;
      if (readConsent()?.choice !== "accepted" || !window.gtag) return;
      if ((window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`])
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!target) return;
      const interaction = getPortfolioEvent(
        target.getAttribute("href")!,
        location.origin,
        {
          email: siteConfig.email,
          whatsapp: siteConfig.links.whatsapp,
        },
      );
      if (!interaction) return;
      window.gtag("event", interaction.name, {
        ...interaction.parameters,
        link_position: target.closest("footer")
          ? "footer"
          : target.closest("header")
            ? "header"
            : "content",
      });
    };
    // Capture also sees Next.js links before navigation replaces their content.
    document.addEventListener("click", track, true);
    document.addEventListener("auxclick", track, true);
    return () => {
      document.removeEventListener("click", track, true);
      document.removeEventListener("auxclick", track, true);
    };
  }, [gaId]);
  return null;
}
