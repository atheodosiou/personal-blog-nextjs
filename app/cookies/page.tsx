import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { PolicyLayout } from "@/components/policy-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy | Anastasios Theodosiou",
  description: "How this portfolio uses browser storage and optional Google Analytics, and how to manage or withdraw your consent.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PolicyLayout title="Cookie policy" intro="What this site remembers, and what you control.">
      <section>
        <h2>Your choice</h2>
        <p>Google Analytics is optional. Its script does not load, set analytics cookies, or send measurements until you choose Accept analytics. Rejecting analytics does not limit access to the portfolio or articles. Scrolling, closing settings, or continuing to browse does not count as acceptance.</p>
        <p>You can accept or reject analytics in the banner, or use <CookieSettingsButton /> at any time. Withdrawing consent stops future collection, removes accessible analytics cookies for this site, and reloads the page to unload the analytics software. It does not automatically delete data already received by Google.</p>
      </section>
      <section>
        <h2>Privacy preference</h2>
        <p>The first-party cookie <code>portfolio_consent</code> stores your accept/reject choice, the policy version and the time you chose. It lasts for 180 days, equally for acceptance and rejection. It is used to respect your choice, not to identify you for analytics. You will be asked again if it expires, is cleared, or the consent version changes.</p>
      </section>
      <section>
        <h2>Colour theme</h2>
        <p>The browser&apos;s local storage entry <code>theme</code> remembers the light, dark or system appearance preference. It stays in your browser until changed or cleared. It does not send usage measurements to Google.</p>
      </section>
      <section>
        <h2>Analytics cookies</h2>
        <p>After acceptance, Google Analytics 4 uses first-party cookies <code>_ga</code> to distinguish browsers and <code>_ga_&lt;measurement-id&gt;</code> to maintain session information. This site configures their lifetime to a maximum of 180 days and disables automatic expiry renewal on visits. Your browser may enforce a shorter lifetime.</p>
        <p>The Google tag is configured with advertising consent denied and Google signals and advertising personalization disabled. No Google Ads tag is added by this site. Cookie lifetime is separate from the retention of data already collected in Google Analytics; see the <Link href="/privacy">Privacy Policy</Link>.</p>
        <p>Read <a href="https://support.google.com/analytics/answer/11397207">Google&apos;s explanation of Analytics cookies</a>.</p>
      </section>
      <section>
        <h2>Comments and external services</h2>
        <p>Article comments use Giscus and GitHub. They load only after you choose Load comments. If you sign in, Giscus may store a login token in browser storage to keep you signed in. This is separate from analytics consent. You can sign out through the comment interface or clear its site storage.</p>
        <p>External links such as LinkedIn, GitHub, DEV and WhatsApp open their own services, which manage their own cookies and privacy settings.</p>
      </section>
      <section>
        <h2>Browser controls</h2>
        <p>You can also delete cookies and local storage through your browser. If the privacy preference cannot be saved, analytics stays off and you may see the banner again. Disabling JavaScript leaves analytics off.</p>
        <p>For questions about data processing or your rights, see the <Link href="/privacy">Privacy Policy</Link>.</p>
      </section>
    </PolicyLayout>
  );
}
