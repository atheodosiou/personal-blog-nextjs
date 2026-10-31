import Link from "next/link";
import { slug } from "github-slugger";
import { getTagLabel } from "@/lib/utils";

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
}

export function Tag({ tag, current, count }: TagProps) {
  return (
    <Link
      className="topic-link"
      href={`/tags/${slug(tag)}`}
      aria-current={current ? "page" : undefined}
    >
      {getTagLabel(tag)}
      {count !== undefined && <span className="topic-count">{count}</span>}
    </Link>
  );
}
