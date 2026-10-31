import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import portrait from "@/public/images/profile.jpg";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="shell contact-grid">
        <div data-reveal>
          <h2>Let&apos;s talk software.</h2>
          <p>
            Have a challenging frontend problem or a project in mind? I&apos;d
            like to hear about it.
          </p>
          <a href={`mailto:${siteConfig.email}`} className="contact-email">
            Say hello <ArrowUpRight size={32} aria-hidden="true" />
          </a>
          <a href={`mailto:${siteConfig.email}`} className="email-address">
            {siteConfig.email}
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
        </div>
      </div>
      <div className="shell footer-bottom">
        <Link href="/">Anastasios Theodosiou</Link>
        <span>Frontend engineering · Thessaloniki, Greece</span>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
