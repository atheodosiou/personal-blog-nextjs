"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, type Variants, easeOut } from "framer-motion";

import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { QueryPagination } from "@/components/query-pagination";
import { Tag } from "@/components/tag";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn, getAllTags, sortPosts, sortTagsByCount } from "@/lib/utils";

const POSTS_PER_PAGE = 5;

// Reusable fade-up variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

// --- Page export with Suspense wrapper (fixes the build error) ---
export default function Page() {
  return (
    <Suspense fallback={<BlogPageFallback />}>
      <BlogPageClient />
    </Suspense>
  );
}

// --- Client implementation (uses useSearchParams) ---
function BlogPageClient() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const { displayPosts, totalPages, tagsMap, sortedTags } = useMemo(() => {
    const sorted = sortPosts(posts.filter((p) => p.published));
    const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
    const displayPosts = sorted.slice(
      POSTS_PER_PAGE * (currentPage - 1),
      POSTS_PER_PAGE * currentPage
    );
    const tagsMap = getAllTags(posts);
    const sortedTags = sortTagsByCount(tagsMap);
    return { displayPosts, totalPages, tagsMap, sortedTags };
  }, [currentPage]);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      {/* Header */}
      <motion.div
        className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="flex-1 space-y-4">
          <div className="flex flex-row items-center justify-between">
            <motion.h1
              className="inline-block font-black text-4xl lg:text-5xl"
              variants={fadeUp}
            >
              Blog
            </motion.h1>

            <motion.div variants={fadeUp}>
              <Link
                href={siteConfig.links.devto}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "sm:w-fit flex gap-2 items-center"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
                Find more on DEV.to
              </Link>
            </motion.div>
          </div>

          <motion.p className="text-xl text-muted-foreground" variants={fadeUp}>
            Blogging: Where Code Meets Conversation
          </motion.p>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-3 mt-8">
        {/* Posts list */}
        <motion.div
          className="col-span-12 col-start-1 sm:col-span-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col">
              {displayPosts.map((post, index) => {
                const { slug, date, title, description, tags } = post;
                return (
                  <motion.li
                    key={slug}
                    className="first:border-t first:border-border"
                    variants={fadeUp}
                    transition={{
                      delay: (index + 1) * 0.12,
                      duration: 0.6,
                      ease: easeOut,
                    }}
                  >
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      description={description}
                      tags={tags}
                    />
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <motion.p variants={fadeUp}>Nothing to see here yet</motion.p>
          )}

          <motion.div
            className="justify-end mt-4 flex"
            variants={fadeUp}
            transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
          >
            <QueryPagination totalPages={totalPages} />
          </motion.div>
        </motion.div>

        {/* Tags card */}
        <motion.div
          className="col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {sortedTags?.map((tag) => (
                <motion.div
                  key={tag}
                  variants={fadeUp}
                  transition={{ duration: 0.4, ease: easeOut }}
                >
                  <Tag tag={tag} count={tagsMap[tag]} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// --- Tiny skeleton while Suspense resolves (keeps build happy) ---
function BlogPageFallback() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="h-10 w-40 rounded bg-muted animate-pulse" />
      <div className="mt-8 grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded bg-muted animate-pulse" />
          ))}
        </div>
        <div className="col-span-12 sm:col-span-4">
          <div className="h-48 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
