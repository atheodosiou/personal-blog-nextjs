import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import portrait from "@/public/images/profile.jpg";
import { CookieSettingsButton } from "@/components/cookie-consent";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="contact-title">
      <div className="shell contact-grid">
        <div className="contact-intro" data-reveal>
          <h2 id="contact-title">
            <span>Have a project?</span>
            <span>Let&apos;s talk.</span>
          </h2>
          <p>
            Web applications, APIs, and developer tools — from architecture to
            production.
          </p>
        </div>
        <div className="contact-details" data-reveal>
          <a
            href={`mailto:${siteConfig.email}`}
            className="primary-action contact-email"
          >
            Email me <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a href={`mailto:${siteConfig.email}`} className="email-address">
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link contact-whatsapp"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Message on WhatsApp
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div className="contact-profile">
            <Image
              src={portrait}
              alt="Anastasios Theodosiou"
              width={88}
              height={88}
              className="contact-portrait"
              sizes="88px"
            />
            <div className="contact-links">
              <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a
                href={siteConfig.links.devto}
                target="_blank"
                rel="noreferrer"
                aria-label="DEV Community profile"
              >
                DEV <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href={siteConfig.links.resume} target="_blank" rel="noreferrer">
                Résumé <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href="/feed.xml">
                RSS feed <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
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
