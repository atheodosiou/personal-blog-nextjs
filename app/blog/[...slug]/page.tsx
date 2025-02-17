"use client";

import Head from "next/head";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { Tag } from "@/components/tag";
import { formatDate } from "@/lib/utils";
import "@/styles/mdx.css";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";

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
    console.log(
      "Meta Tags in DOM:",
      document.querySelector("meta[property='og:image']")
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", "article_view", {
        page_title: post.title,
        page_path: `/blog/${params.slug.join("/")}`,
        page_location: window.location.href,
      });
      console.log("Custom article_view event sent via gtag");
    } else {
      console.error(
        "gtag is not defined. Ensure Google Analytics is properly initialized."
      );
    }
  }, [params.slug, post.title]);

  // Generate the absolute URL for the Open Graph image
  const siteUrl = "https://anastasios.theodosiou.me";
  const ogImage = post.header?.startsWith("/")
    ? `${siteUrl}${post.header}`
    : `${siteUrl}/${post.header}`;
  // console.log("🚀 post.header:", post.header);
  // console.log("🔍 Constructed ogImage URL:", ogImage);

  useEffect(() => {
    console.log("🔄 Updating Meta Tags in DOM");

    document
      .querySelector("meta[property='og:image']")
      ?.setAttribute("content", ogImage);

    document
      .querySelector("meta[property='og:image:secure_url']")
      ?.setAttribute("content", ogImage);

    document
      .querySelector("meta[name='twitter:image']")
      ?.setAttribute("content", ogImage);
  }, [ogImage]);
  return (
    <>
      <Head>
        {/*  Dynamic Meta Tags */}
        <title>{post.title}</title>
        <meta name="description" content={post.description} />

        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${siteUrl}/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Anastasios Theodosiou" />
        <meta property="og:locale" content="en_US" />

        {/* Article-Specific Meta Tags */}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.date} />
        <meta property="article:author" content={`${siteUrl}/about`} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:creator" content="@authorhandle" />
      </Head>

      <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">
        <h1 className="mb-2">{post.title}</h1>
        <div className="flex gap-2 mb-2 flex-wrap">
          {post.tags?.map((tag: string) => (
            <Tag tag={tag} key={tag} />
          ))}
        </div>
        {post.description && (
          <p className="text-xl mt-0 text-muted-foreground">
            {post.description}
          </p>
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
    </>
  );
}
