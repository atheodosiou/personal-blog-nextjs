"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MotionBoundary({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(
      root.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [],
    );
    if (!("IntersectionObserver" in window) || media.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05 },
    );
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.dataset.visible = "false";
        observer.observe(element);
      }
    });
    const showAll = () => {
      if (media.matches) {
        observer.disconnect();
        elements.forEach((element) => {
          element.dataset.visible = "true";
        });
      }
    };
    media.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", showAll);
      elements.forEach((element) => {
        delete element.dataset.visible;
      });
    };
  }, [pathname]);
  return <div ref={root}>{children}</div>;
}
