import type { Metadata } from "next";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { Tag } from "@/components/tag";
import { formatDate, getDisplayTitle } from "@/lib/utils";
import "@/styles/mdx.css";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import GiscusComments from "@/components/giscus-comments";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbSchema, pageMetadata, personId, websiteId } from "@/lib/seo";

export const generateStaticParams = () =>
  posts.filter((post) => post.published).map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(
    (post) => post.slugAsParams === slug.join("/"),
  );
  if (!post || !post.published) notFound();
  const ogImage = post.header
    ? new URL(post.header, siteConfig.url).toString()
    : new URL("/opengraph-image.png", siteConfig.url).toString();
  const title = post.title.replace(/`/g, "");
  const base = pageMetadata({
    title,
    description: post.description ?? siteConfig.description,
    path: `/blog/${post.slugAsParams}`,
  });
  return {
    ...base,
    authors: [{ name: post.author ?? siteConfig.author, url: absoluteUrl("/about") }],
    keywords: post.keywords,
    openGraph: {
      title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slugAsParams}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [absoluteUrl("/about")],
      tags: post.tags,
      images: [{ url: ogImage, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [ogImage],
      site: "@atheodosiou91",
      creator: "@atheodosiou91",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find(
    (post) => post.slugAsParams === slug.join("/"),
  );
  if (!post || !post.published) notFound();
  return (
    <article>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": absoluteUrl(`/blog/${post.slugAsParams}#article`),
        url: absoluteUrl(`/blog/${post.slugAsParams}`),
        mainEntityOfPage: absoluteUrl(`/blog/${post.slugAsParams}`),
        isPartOf: { "@id": websiteId },
        headline: getDisplayTitle(post.slug, post.title),
        alternativeHeadline: post.title.replace(/`/g, ""),
        description: post.description,
        image: absoluteUrl(post.header ?? "/opengraph-image.png"),
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: { "@type": "Person", "@id": personId, name: post.author ?? siteConfig.author, url: absoluteUrl("/about") },
        publisher: { "@id": personId },
        inLanguage: "en",
        keywords: post.tags,
      }} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Writing", path: "/blog" },
        { name: getDisplayTitle(post.slug, post.title), path: `/blog/${post.slugAsParams}` },
      ])} />
      <header className="article-header shell">
        <Link href="/blog" className="text-link mb-8">
          <ArrowLeft size={17} aria-hidden="true" />
          All writing
        </Link>
        <h1>{getDisplayTitle(post.slug, post.title)}</h1>
        {post.description && <p>{post.description}</p>}
        <div className="post-meta">
          <Link href="/about" rel="author">{post.author ?? siteConfig.author}</Link>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime.replace("'", " min")} read</span>
          {post.devTo && (
            <a
              href={post.devTo}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Read on DEV <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="post-tags">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag tag={tag} key={tag} />
          ))}
        </div>
      </header>
      <div className="article-content">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent code={post.body} />
        </div>
        {siteConfig.links.buymeacoffee && (
          <div className="article-support">
            <p>Found this useful? You can support my writing.</p>
            <a
              href={siteConfig.links.buymeacoffee}
              target="_blank"
              rel="noreferrer"
              className="text-link mt-3"
            >
              Buy me a coffee <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        )}
        <section
          className="article-comments"
          aria-labelledby="comments-heading"
        >
          <h2 id="comments-heading" className="mb-6">
            Discussion
          </h2>
          <GiscusComments />
        </section>
      </div>
    </article>
  );
}
