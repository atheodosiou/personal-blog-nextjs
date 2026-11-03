import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Canonicals always identify the public site, including in local/preview builds.
export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export const personId = absoluteUrl("/#person");
export const websiteId = absoluteUrl("/#website");
export const defaultImage = absoluteUrl("/opengraph-image.png");

export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image ? absoluteUrl(image) : defaultImage,
          alt: imageAlt ?? `${siteConfig.name} — ${siteConfig.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ? absoluteUrl(image) : defaultImage],
    },
  };
}

export const identitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
      url: absoluteUrl("/about"),
      image: absoluteUrl("/images/profile.jpg"),
      jobTitle: siteConfig.role,
      description: siteConfig.description,
      homeLocation: {
        "@type": "Place",
        name: "Thessaloniki, Greece",
      },
      knowsAbout: [
        "Angular",
        "JavaScript",
        "TypeScript",
        "Frontend architecture",
        "React",
        "Next.js",
        "Node.js",
        "NestJS",
        "PostgreSQL",
        "Software testing",
      ],
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        siteConfig.links.devto,
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: absoluteUrl(),
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
  ],
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
