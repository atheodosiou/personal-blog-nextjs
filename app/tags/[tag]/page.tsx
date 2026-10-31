import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { Tag } from "@/components/tag";
import {
  getAllTags,
  getPostsByTagSlug,
  getTagLabel,
  sortTagsByCount,
  sortPosts,
} from "@/lib/utils";
import { slug } from "github-slugger";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface TagPageProps {
  params: { tag: string };
}
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const label = getTagLabel(params.tag.split("-").join(" "));
  return {
    title: `${label} | Anastasios Theodosiou`,
    description: `Writing on ${label} and practical frontend engineering.`,
  };
}
export const generateStaticParams = () =>
  Object.keys(getAllTags(posts)).map((tag) => ({ tag: slug(tag) }));

export default function TagPage({ params }: TagPageProps) {
  const displayPosts = sortPosts(
    getPostsByTagSlug(posts, params.tag).filter((post) => post.published),
  );
  if (!displayPosts.length) notFound();
  const tags = getAllTags(posts);
  const label =
    Object.keys(tags).find((tag) => slug(tag) === params.tag) ??
    params.tag.split("-").join(" ");
  return (
    <div className="shell">
      <header className="page-intro">
        <h1>{getTagLabel(label)}</h1>
        <p>
          {displayPosts.length}{" "}
          {displayPosts.length === 1 ? "article" : "articles"} from practice.
        </p>
      </header>
      <div className="writing-layout">
        <div className="article-list">
          {displayPosts.map((post) => (
            <div key={post.slug} data-reveal>
              <PostItem {...post} />
            </div>
          ))}
        </div>
        <aside className="writing-sidebar" aria-label="Writing topics">
          <h2>Explore topics</h2>
          <div className="topic-list">
            {sortTagsByCount(tags)
              .slice(0, 6)
              .map((tag) => (
                <Tag
                  tag={tag}
                  key={tag}
                  count={tags[tag]}
                  current={slug(tag) === params.tag}
                />
              ))}
          </div>
          <Link href="/blog" className="text-link">
            All writing →
          </Link>
        </aside>
      </div>
    </div>
  );
}
