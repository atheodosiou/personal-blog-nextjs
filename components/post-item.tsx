import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, getDisplayTitle } from "@/lib/utils";
import { Tag } from "./tag";

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  readTime?: string;
  compact?: boolean;
  header?: string;
  latest?: boolean;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags,
  readTime,
  compact = false,
}: PostItemProps) {
  const Heading = compact ? "h3" : "h2";
  return (
    <article className={`post-item ${compact ? "post-compact" : ""}`}>
      <div className="post-meta">
        <time dateTime={date}>{formatDate(date)}</time>
        {readTime && <span>{readTime.replace("'", " min")} read</span>}
      </div>
      <div>
        <Heading>
          <Link href={"/" + slug} title={title}>
            {getDisplayTitle(slug, title)}
          </Link>
        </Heading>
        {description && <p className="post-description">{description}</p>}
      </div>
      <div className="post-bottom">
        <div className="post-tags">
          {tags?.slice(0, 3).map((tag) => (
            <Tag tag={tag} key={tag} />
          ))}
        </div>
        <Link
          href={"/" + slug}
          className="text-link"
          aria-label={`Read ${title}`}
        >
          Read article <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
