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

interface PostPageProps {
  params: { slug: string[] };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = posts.find(
    (post) => post.slugAsParams === params.slug.join("/"),
  );
  if (!post || !post.published)
    return { title: "Not Found", description: "This page does not exist." };
  const ogImage = post.header
    ? new URL(post.header, siteConfig.url).toString()
    : new URL("/opengraph-image.png", siteConfig.url).toString();
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author ?? siteConfig.author }],
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slugAsParams}`,
      siteName: siteConfig.name,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      site: "@atheodosiou91",
      creator: "@atheodosiou91",
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = posts.find(
    (post) => post.slugAsParams === params.slug.join("/"),
  );
  if (!post || !post.published) notFound();
  return (
    <article>
      <header className="article-header shell">
        <Link href="/blog" className="text-link mb-8">
          <ArrowLeft size={17} aria-hidden="true" />
          All writing
        </Link>
        <h1>{getDisplayTitle(post.slug, post.title)}</h1>
        {post.description && <p>{post.description}</p>}
        <div className="post-meta">
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
