import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CookieConsentProvider } from "@/components/cookie-consent";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionBoundary } from "@/components/motion-boundary";
import { JsonLd } from "@/components/json-ld";
import { identitySchema } from "@/lib/seo";
import { AnalyticsInteractions } from "@/components/analytics-interactions";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "../assets/fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/GeneralSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author, url: `${siteConfig.url}/about` }],
  creator: siteConfig.author,
  alternates: {
    types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "-YtHlJA-AGFUUWt8WP7SgCsiGXwwmpDlzuufVfkDRc0",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          generalSans.variable,
        )}
      >
        <JsonLd data={identitySchema} />
        <Providers>
          <CookieConsentProvider gaId={process.env.GAID}>
            <AnalyticsInteractions gaId={process.env.GAID} />
            <div
              id="top"
              className="relative flex min-h-dvh flex-col bg-background"
            >
              <a href="#main-content" className="skip-link">
                Skip to content
              </a>
              <SiteHeader />
              <MotionBoundary>
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <SiteFooter />
              </MotionBoundary>
            </div>
          </CookieConsentProvider>
        </Providers>
      </body>
    </html>
  );
}
