import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionBoundary } from "@/components/motion-boundary";
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
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
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
        <Providers>
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
        </Providers>
      </body>
      {process.env.GAID && <GoogleAnalytics gaId={process.env.GAID} />}
    </html>
  );
}
