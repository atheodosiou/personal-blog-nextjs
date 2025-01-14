"use client";

import { useEffect } from "react";
import { posts } from "#site/content";
import { notFound } from "next/navigation";
import { Tag } from "@/components/tag";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import "@/styles/mdx.css";
import { Calendar } from "lucide-react";
import { MDXContent } from "@/components/mdx-components";
import { sendGAEvent } from "@next/third-parties/google";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

export default function PostPage({ params }: PostPageProps) {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);

  if (!post || !post.published) {
    notFound();
  }

  useEffect(() => {
    // Trigger the `article_view` event
    sendGAEvent("article_view", {
      page_title: post.title,
      page_path: `/blog/${slug}`,
      page_location: window.location.href,
    });
  }, [slug, post.title]);

  return (
    <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">
      <h1 className="mb-2">{post.title}</h1>
      <div className="flex gap-2 mb-2 flex-wrap">
        {post.tags?.map((tag: string) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      {post.description && (
        <p className="text-xl mt-0 text-muted-foreground">{post.description}</p>
      )}
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between">
        <div className="sr-only">Published On</div>
        <div className="text-sm sm:text-base font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <div className="text-sm sm:text-base font-medium flex items-center gap-1">
          <span>Read Time:</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      <hr className="my-2" />
      <MDXContent code={post.body} />
    </article>
  );
}
