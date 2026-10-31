import { getAllTags, sortTagsByCount } from "@/lib/utils";
import type { Metadata } from "next";
import { posts } from "#site/content";
import { Tag } from "@/components/tag";

export const metadata: Metadata = {
  title: "Topics | Anastasios Theodosiou",
  description:
    "Browse writing on Angular, TypeScript, architecture, and frontend engineering.",
};

export default function TagsPage() {
  const tags = getAllTags(posts);
  return (
    <div className="shell">
      <header className="page-intro">
        <h1>Explore topics</h1>
        <p>Find the ideas and engineering details you&apos;re interested in.</p>
      </header>
      <div className="topic-collection">
        {sortTagsByCount(tags).map((tag) => (
          <Tag tag={tag} count={tags[tag]} key={tag} />
        ))}
      </div>
    </div>
  );
}
