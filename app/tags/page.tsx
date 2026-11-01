import { getAllTags, sortTagsByCount } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { posts } from "#site/content";
import { Tag } from "@/components/tag";

export const metadata = pageMetadata({
  title: "Topics | Anastasios Theodosiou",
  description:
    "Browse articles on Angular, JavaScript, TypeScript, frontend and backend engineering, and software architecture.",
  path: "/tags",
});

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
