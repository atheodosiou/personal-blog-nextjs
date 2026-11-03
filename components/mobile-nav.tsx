"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ArrowUpRight } from "lucide-react";
import { MobileNavTrigger } from "./header-control-triggers";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function MobileNav({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MobileNavTrigger />
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
            { href: "/projects", label: "Work" },
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
