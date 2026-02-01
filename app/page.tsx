"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, sortPosts } from "@/lib/utils";
import { posts } from "#site/content";
import Link from "next/link";
import { PostItem } from "@/components/post-item";
import { motion, type Variants, easeOut } from "framer-motion";

export default function Home() {
  const latestPosts = sortPosts(posts).slice(0, 3);

  // Animation variants with proper easing type
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <>
      <motion.section
        className="space-y-6 pb-8 pt-6 md:pb-12 md:mt-5 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="container flex flex-col gap-10 text-center">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-balance"
            variants={fadeUp}
          >
            Hello, I&apos;m Anastasios
          </motion.h1>

          <motion.p
            className="max-w-[42rem] mx-auto text-muted-foreground sm:text-xl"
            variants={fadeUp}
          >
            👋 I’m a Senior Angular Engineer based in Thessaloniki, Greece,
            focused on building clean, scalable web apps with Angular and the
            MEAN stack. I love crafting intuitive UIs 🎨, diving into full-stack
            development with Node.js, NestJS, and MongoDB 🚀, and sharing what I
            learn along the way ✍️.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 justify-center sm:flex-row"
            variants={fadeUp}
          >
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-fit flex gap-2 items-center"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M3.75 3a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 0 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V16C17 8.82 11.18 3 4 3h-.25Z" />
                <path d="M3 8.75A.75.75 0 0 1 3.75 8H4a8 8 0 0 1 8 8v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V16a6 6 0 0 0-6-6h-.25A.75.75 0 0 1 3 9.25v-.5ZM7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
              </svg>
              View my blog
            </Link>

            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit flex gap-2 items-center"
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
                  d="M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06ZM11.377 2.011a.75.75 0 0 1 .612.867l-2.5 14.5a.75.75 0 0 1-1.478-.255l2.5-14.5a.75.75 0 0 1 .866-.612Z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </Link>

            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit flex gap-2 items-center"
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
              LinkedIn
            </Link>

            <Link
              href={siteConfig.links.devto}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit flex gap-2 items-center"
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
              dev.to
            </Link>

            <Link
              href={siteConfig.links.resume}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit flex gap-2 items-center"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              Resume
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="container max-w-4xl py-6 flex flex-col space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center">
          Latest Posts
        </h2>

        <ul className="flex flex-col">
          {latestPosts.map(
            (post, index) =>
              post.published && (
                <motion.li
                  key={post.slug}
                  className="first:border-t first:border-border"
                  variants={fadeUp}
                  transition={{
                    delay: (index + 1) * 0.15,
                    duration: 0.6,
                    ease: easeOut,
                  }}
                >
                  <PostItem
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    tags={post.tags}
                    latest={index === 0}
                  />
                </motion.li>
              )
          )}
        </ul>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section
        className="container max-w-4xl py-6 flex flex-col space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Featured Projects
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            className="border rounded-lg shadow flex flex-col items-center pb-6"
            variants={fadeUp}
            transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/images/articles/the-missing-piece-in-angular-i18n/landing_page.png"
              alt="xlf-sync"
              className="w-full h-48 object-cover rounded-t mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">xlf-sync</h3>
            <p className="mb-2 text-muted-foreground text-center">
              Command line tool to sync angular i18n files
            </p>
            <div className="flex flex-row items-center gap-6">
              <a
                href="https://atheodosiou.github.io/xlf-sync/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Docs
              </a>
              <a
                href="https://github.com/atheodosiou/xlf-sync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/xlf-sync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                NPM
              </a>
            </div>
          </motion.div>

          <motion.div
            className="border rounded-lg shadow flex flex-col items-center pb-6"
            variants={fadeUp}
            transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/images/projects/capmentor.png"
              alt="Project Two"
              className="w-full h-48 object-cover rounded-t mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Capmentor.com</h3>
            <p className="mb-2 text-muted-foreground text-center">
              Compound Interest Calculator
            </p>
            <div className="flex flex-row items-center gap-6">
              <a
                href="https://capmentor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Visit
              </a>
              <a
                href="https://github.com/atheodosiou/capmentor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>

          <motion.div
            className="border rounded-lg shadow flex flex-col items-center pb-6"
            variants={fadeUp}
            transition={{ delay: 0.45, duration: 0.6, ease: easeOut }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/images/projects/engineerofficertest.png"
              alt="Project Two"
              className="w-full h-48 object-cover rounded-t mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Engineerofficertest.com
            </h3>
            <p className="mb-2 text-muted-foreground text-center px-6">
              Marine Engineer/Officer Exams Preparation Platform (Private)
            </p>
            <div className="flex flex-row items-center gap-6">
              <a
                href="https://engineerofficertest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Visit
              </a>
            </div>
          </motion.div>

          <motion.div
            className="border rounded-lg shadow flex flex-col items-center pb-6 pt-6"
            variants={fadeUp}
            transition={{ delay: 0.6, duration: 0.6, ease: easeOut }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/images/projects/github.png"
              alt="Project Two"
              className="h-48 rounded-t mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">GitHub Projects</h3>
            <p className="mb-2 text-muted-foreground text-center">
              Find more personal projects on GitHub
            </p>
            <a
              href="https://github.com/atheodosiou"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Find more on GitHub
            </a>
          </motion.div>
        </div>
      </motion.section>
      {/* End Featured Projects Section */}
    </>
  );
}
