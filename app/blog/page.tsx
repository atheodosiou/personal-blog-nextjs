import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { QueryPagination } from "@/components/query-pagination";
import { Tag } from "@/components/tag";
import { siteConfig } from "@/config/site";
import { getAllTags, sortTagsByCount } from "@/lib/utils";
import type { Metadata } from "next";
import { getBlogPagination } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const { currentPage, path } = getBlogPagination(page);
  return pageMetadata({
    title: `Writing${currentPage > 1 ? ` — Page ${currentPage}` : ""} | ${siteConfig.name}`,
    description:
      "Practical articles on JavaScript, TypeScript, frontend and backend engineering, Angular, and building complete software products.",
    path,
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;
  const { totalPages, displayPosts } = getBlogPagination(page);
  const tags = getAllTags(posts);
  const topics = sortTagsByCount(tags).slice(0, 6);
  return (
    <div className="shell">
      <header className="page-intro">
        <h1>Writing</h1>
        <p>
          Practical lessons from enterprise applications, independent products,
          and the tools I build along the way. Frontend, backend, and the
          decisions that connect them.
        </p>
      </header>
      <div className="writing-layout">
        <div>
          <div className="article-list">
            {displayPosts.map((post) => (
              <div key={post.slug} data-reveal>
                <PostItem {...post} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-wrap">
              <Suspense>
                <QueryPagination totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
        <aside className="writing-sidebar" aria-label="Browse writing">
          <h2>Explore topics</h2>
          <div className="topic-list">
            {topics.map((tag) => (
              <Tag key={tag} tag={tag} count={tags[tag]} />
            ))}
          </div>
          <Link href="/tags" className="text-link">
            All topics <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a
            href={siteConfig.links.devto}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Also on DEV <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </div>
  );
}
