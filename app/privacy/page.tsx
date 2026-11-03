import Link from "next/link";
import { PolicyLayout } from "@/components/policy-layout";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy | Anastasios Theodosiou",
  description: "How Anastasios Theodosiou's portfolio handles optional analytics, contact messages, hosting, comments, and your privacy rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy policy" intro="How information is handled when you visit or get in touch.">
      <section>
        <h2>Who is responsible</h2>
        <p>This portfolio at <a href={siteConfig.url}>anastasios.theodosiou.me</a> is operated by {siteConfig.name}, based in Thessaloniki, Greece, who is responsible for its processing of personal data. For privacy questions or requests, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      </section>
      <section>
        <h2>Delivering the website</h2>
        <p>The site is hosted on a Contabo VPS, with domain/DNS services provided through Cloudflare. Delivering and protecting the site involves connection data such as IP addresses, request URLs, timestamps, browser information and security logs. Where Cloudflare proxy or security services are enabled, those services also handle relevant website requests.</p>
        <p>This operational processing supports the legitimate interests of providing a working, secure website. Operational records are retained only for as long as needed for troubleshooting, security investigations and applicable legal obligations. Hosting and infrastructure providers may process this information as needed to provide their services.</p>
        <p>Provider information: <a href="https://contabo.com/en/legal/privacy/">Contabo privacy policy</a> and <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare privacy policy</a>.</p>
      </section>
      <section>
        <h2>Optional audience measurement</h2>
        <p>With your consent, Google Analytics 4 helps me understand which pages are useful and how visitors navigate the site. Measurements can include pages visited, scrolling, outbound link clicks, résumé file-link clicks, contact-button clicks, project-link clicks, session information, browser/device details, approximate location and cookie-based identifiers. Contact and project events use fixed labels; they do not contain your messages, email address or phone number. A contact click indicates interest, rather than confirming that a message was sent. Google receives connection information when its service is contacted.</p>
        <p>The legal basis is your consent. Google&apos;s tag is blocked until acceptance, with advertising consent denied and Google signals and ad personalization disabled in the tag configuration. You can withdraw through <CookieSettingsButton /> without losing access to the site. Withdrawal stops future collection; it does not affect the lawfulness of earlier processing.</p>
        <p>The Analytics property retains event data for 2 months and user data for 14 months. The user-data retention period resets when the user has new activity. Google deletes applicable data through its scheduled deletion process. Standard aggregated reports are not covered by these retention settings and can remain longer. These periods are separate from this site&apos;s 180-day analytics cookie lifetime. Contact me for information about the configuration or a deletion request.</p>
        <p>Google may process information outside the European Economic Area. Details about Google&apos;s processing and applicable international-transfer safeguards are available in <a href="https://policies.google.com/privacy">Google&apos;s Privacy Policy</a> and <a href="https://business.safety.google/adsprocessorterms/">Google&apos;s data processing terms</a>. See also <a href="https://support.google.com/analytics/answer/7667196">Google&apos;s retention documentation</a>.</p>
      </section>
      <section>
        <h2>Contacting me</h2>
        <p>If you contact me by email or WhatsApp, I receive the contact details and message you choose to send. I use them to reply and, where relevant, discuss or carry out work you request. The basis is taking steps at your request before a contract, or the legitimate interest of responding to other correspondence.</p>
        <p>Correspondence is kept for as long as needed to handle the conversation, any resulting professional relationship and applicable legal obligations. Email and messaging services also process information under their own terms. Please avoid sending sensitive information that is not needed for your enquiry.</p>
      </section>
      <section>
        <h2>Comments and linked content</h2>
        <p>Giscus/GitHub comments load when you choose Load comments. Loading the service shares connection data with those providers. If you post a comment or reaction, the profile details and content you submit can be public on GitHub and in the embedded discussion. Signing in is optional for reading comments.</p>
        <p>Review <a href="https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md">Giscus&apos;s Privacy Policy</a> and <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub&apos;s Privacy Statement</a>. Manage or delete your comments through GitHub, or contact me for help. Articles may also include externally hosted images; requesting those images exposes connection data to their hosting providers.</p>
        <p>Links to other products and social profiles take you to separate services with their own policies. This policy covers this portfolio, rather than every linked product.</p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>Depending on the processing and applicable conditions, you can request access, correction, deletion, restriction or portability of your personal data, and object to processing based on legitimate interests. You can withdraw analytics consent at any time. Contact <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> to exercise your rights.</p>
        <p>You can lodge a complaint with the <a href="https://www.dpa.gr/">Hellenic Data Protection Authority</a> or your competent supervisory authority. This site does not use analytics to make automated decisions with legal or similarly significant effects about visitors.</p>
      </section>
      <section>
        <h2>Browser storage and changes</h2>
        <p>The <Link href="/cookies">Cookie Policy</Link> describes the privacy-choice cookie, theme storage and optional analytics cookies. This policy will be updated when the site&apos;s processing changes; the revision date appears above.</p>
      </section>
    </PolicyLayout>
  );
}
