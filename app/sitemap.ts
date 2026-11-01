import type { MetadataRoute } from "next";
import { slug } from "github-slugger";
import { getPublishedPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import { getAllTags } from "@/lib/utils";
import { projects } from "@/config/projects";
import { topicGuides } from "@/config/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const published = getPublishedPosts();
  const lastUpdated = (items: typeof published) =>
    items
      .map((post) => post.updated ?? post.date)
      .sort()
      .at(-1);
  const latestArticleUpdate = lastUpdated(published);
  const totalPages = Math.max(1, Math.ceil(published.length / POSTS_PER_PAGE));

  return [
    // Actual profile revision date, rather than a new timestamp on every build.
    { url: absoluteUrl(), lastModified: "2026-11-01" },
    { url: absoluteUrl("/about"), lastModified: "2026-11-01" },
    { url: absoluteUrl("/privacy"), lastModified: "2026-11-01" },
    { url: absoluteUrl("/cookies"), lastModified: "2026-11-01" },
    { url: absoluteUrl("/blog"), lastModified: latestArticleUpdate },
    { url: absoluteUrl("/tags"), lastModified: "2026-11-01" },
    { url: absoluteUrl("/projects"), lastModified: "2026-11-01" },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: "2026-11-01",
    })),
    ...Array.from({ length: totalPages - 1 }, (_, index) => ({
      url: absoluteUrl(`/blog?page=${index + 2}`),
      lastModified: latestArticleUpdate,
    })),
    ...published.map((post) => ({
      url: absoluteUrl(`/blog/${post.slugAsParams}`),
      lastModified: post.updated ?? post.date,
    })),
    ...Object.keys(getAllTags(published))
      .filter((tag) => Boolean(topicGuides[slug(tag)]))
      .map((tag) => ({
        url: absoluteUrl(`/tags/${slug(tag)}`),
        lastModified: "2026-11-01",
      })),
  ];
}
