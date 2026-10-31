import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Post } from "#site/content";
import { slug } from "github-slugger";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function sortPosts(posts: Array<Post>) {
  return [...posts].sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}

export function getAllTags(posts: Array<Post>) {
  const tags: Record<string, number> = {};
  posts.forEach((post) => {
    if (post.published) {
      post.tags?.forEach((tag) => {
        const label = getTagLabel(tag);
        tags[label] = (tags[label] ?? 0) + 1;
      });
    }
  });

  return tags;
}

export function sortTagsByCount(tags: Record<string, number>) {
  return Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
}

export function getPostsByTagSlug(posts: Array<Post>, tag: string) {
  return posts.filter((post) => {
    if (!post.tags) return false;
    const slugifiedTags = post.tags.map((tag) => slug(tag));
    return slugifiedTags.includes(tag);
  });
}

export function getTagLabel(tag: string) {
  const labels: Record<string, string> = {
    angular: "Angular",
    typescript: "TypeScript",
    cli: "CLI",
    i18n: "i18n",
    webdev: "Webdev",
  };
  return labels[slug(tag)] ?? tag;
}

export function getDisplayTitle(postSlug: string, fallback: string) {
  const titles: Record<string, string> = {
    "the-missing-piece-in-angular-i18n": "The missing piece in Angular i18n",
    "improve-angular-performance-with-onpush-change-detection":
      "Angular change detection",
    "exhaustive-checks": "Exhaustive checks in TypeScript",
    "front-end-architecture": "Frontend architecture that scales",
    "let-template-variables-angular-18": "Template variables with @let",
  };
  return titles[postSlug.split("/").pop() ?? ""] ?? fallback;
}
