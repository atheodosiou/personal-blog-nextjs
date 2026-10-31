import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { QueryPagination } from "@/components/query-pagination";
import { Tag } from "@/components/tag";
import { siteConfig } from "@/config/site";
import { getAllTags, sortPosts, sortTagsByCount } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing | Anastasios Theodosiou",
  description:
    "Practical articles on JavaScript, TypeScript, frontend and backend engineering, Angular, and building complete software products.",
};
const POSTS_PER_PAGE = 5;

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const published = sortPosts(posts.filter((post) => post.published));
  const totalPages = Math.max(1, Math.ceil(published.length / POSTS_PER_PAGE));
  const requestedPage = Number(searchParams.page);
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(totalPages, Math.max(1, requestedPage))
    : 1;
  const displayPosts = published.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );
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
