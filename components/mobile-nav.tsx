"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation"
        >
          <Menu size={21} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="mobile-menu-panel"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>Explore</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="mobile-menu-links">
          {[
            { href: "/", label: "Home" },
            { href: "/#work", label: "Work" },
            { href: "/blog", label: "Writing" },
            { href: "/about", label: "About" },
            { href: "/#contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href={siteConfig.links.resume}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Download résumé <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </SheetContent>
    </Sheet>
  );
}
