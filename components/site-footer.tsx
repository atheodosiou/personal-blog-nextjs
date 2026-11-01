import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import portrait from "@/public/images/profile.jpg";
import { CookieSettingsButton } from "@/components/cookie-consent";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="shell contact-grid">
        <div data-reveal>
          <h2>Let&apos;s talk software.</h2>
          <p>
            Working on a web application, an API, or a new product? Get in touch
            to discuss architecture, implementation, or delivery.
          </p>
          <a href={`mailto:${siteConfig.email}`} className="contact-email">
            Say hello <ArrowUpRight size={32} aria-hidden="true" />
          </a>
          <a href={`mailto:${siteConfig.email}`} className="email-address">
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-action mt-6"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Message on WhatsApp
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <Image
          src={portrait}
          alt="Anastasios Theodosiou"
          width={160}
          height={160}
          className="contact-portrait"
          sizes="160px"
        />
        <div className="contact-links" data-reveal>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href={siteConfig.links.devto} target="_blank" rel="noreferrer">
            DEV Community <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href={siteConfig.links.resume} target="_blank" rel="noreferrer">
            Résumé <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href="/feed.xml">RSS feed <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <nav className="shell footer-legal" aria-label="Privacy and cookies">
        <Link href="/privacy">Privacy policy</Link>
        <Link href="/cookies">Cookie policy</Link>
        <CookieSettingsButton />
      </nav>
      <div className="shell footer-bottom">
        <Link href="/">Anastasios Theodosiou</Link>
        <span>Full-stack engineering · Thessaloniki, Greece</span>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
