import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";

import { Tag } from "@/components/tag";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import "@/styles/mdx.css";
import { Calendar } from "lucide-react";
import { Metadata } from "next";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", post.title);

  const metadata: Metadata = {
    title: post.title,
    description: post.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: post.slug,
      images: [
        {
          url: `${siteConfig.url}/${
            post.header || "images/fallback-post-image.png"
          }`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [
        {
          url: `${siteConfig.url}/${
            post.header || "images/fallback-post-image.png"
          }`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    keywords: post.tags,
  };
  return metadata;
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return posts.map((post) => ({ slug: post.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://anastasios.theodosiou.me"
      : "http://127.0.0.1:3000";
  //Register view
  const res = await fetch(`${baseUrl}/api/blog/${params.slug}/registerView`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  //Fetch post views
  const res2 = await fetch(`${baseUrl}/api/blog/${params.slug}/views`);
  if (!res2.ok) {
    throw new Error("Failed to fetch data");
  }
  const { views } = await res2.json();

  return (
    <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">
      <h1 className="mb-2">{post.title}</h1>
      <div className="flex gap-2 mb-2">
        {post.tags?.map((tag: string) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      {post.description ? (
        <p className="text-xl mt-0 text-muted-foreground">{post.description}</p>
      ) : null}
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between">
        <div className="sr-only">Published On</div>
        <div className="text-sm sm:text-base font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <div className="text-sm sm:text-base font-medium flex items-center gap-1">
          <span>Views:</span>
          <span>{views}</span>
        </div>
      </div>
      <hr className="my-2" />
      <MDXContent code={post.body} />
    </article>
  );
}
