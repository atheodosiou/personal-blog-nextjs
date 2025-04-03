import { Metadata } from "next";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { Tag } from "@/components/tag";
import { formatDate } from "@/lib/utils";
import "@/styles/mdx.css";
import { Calendar, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import GiscusComments from "@/components/giscus-comments";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import Image from "next/image";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

// ✅ Define generateMetadata function to create dynamic metadata
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);

  if (!post || !post.published) {
    return { title: "Not Found", description: "This page does not exist." };
  }

  const siteUrl = "https://anastasios.theodosiou.me";
  const ogImage = `${siteUrl}/${post.header}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      siteName: "Anastasios Theodosiou",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      site: "@atheodosiou91",
      creator: "@atheodosiou91",
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);

  if (!post || !post.published) {
    notFound();
  }

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
        <div className="flex flex-row items-center gap-4">
          {post?.devTo && (
            <Link
              href={post.devTo}
              target="_blank"
              rel="noreferrer"
              className="text-sm sm:text-base font-medium flex items-center gap-1 no-underline hover:text-blue-500"
            >
              <ExternalLink className="h-4 w-4" /> DEV.to
            </Link>
          )}
          <div className="text-sm sm:text-base font-medium flex items-center gap-1">
            <span>Read Time:</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
      <hr className="my-2" />
      <MDXContent code={post.body} />

      {siteConfig?.links?.buymeacoffee && (
        <>
          <hr className="my-10" />
          <div className="flex flex-col justify-center items-center">
            Thanks for reading! If you'd like to support my work, you can buy me
            a coffee ☕
            <Link
              href={siteConfig.links.buymeacoffee}
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me a Coffee"
                width={162}
                height={45}
              />
            </Link>
          </div>
          <hr className="my-2" />
        </>
      )}

      {/* 🗨️ Comments Section */}
      <section className="mt-12">
        <GiscusComments />
      </section>
    </article>
  );
}
