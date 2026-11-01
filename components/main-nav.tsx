"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="main-nav" aria-label="Main navigation">
      <Link
        href="/"
        className="wordmark"
        aria-label="Anastasios Theodosiou, home"
      >
        Anastasios Theodosiou
        <span className="wordmark-dot" aria-hidden="true">
          .
        </span>
      </Link>
      <div className="desktop-nav">
        <Link href="/projects" aria-current={pathname.startsWith("/projects") ? "page" : undefined}>Work</Link>
        <Link
          href="/blog"
          aria-current={pathname.startsWith("/blog") ? "page" : undefined}
        >
          Writing
        </Link>
        <Link
          href="/about"
          aria-current={pathname === "/about" ? "page" : undefined}
        >
          About
        </Link>
        <Link href="/#contact">Contact</Link>
      </div>
    </nav>
  );
}
