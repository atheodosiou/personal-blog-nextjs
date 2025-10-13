"use client";

import Link from "next/link";
import { motion, type Variants, easeOut } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig, workExperienceAndEducationInfo } from "@/config/site";
import Timeline from "@/components/work-timeline";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function AboutPage() {
  const timelineItems = workExperienceAndEducationInfo.experience;
  const educationItems = workExperienceAndEducationInfo.education;

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      {/* Header */}
      <motion.div
        className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="flex-1 space-x-4">
          <motion.h1
            className="inline-block font-black text-4xl lg:text-5xl"
            variants={fadeUp}
          >
            About Me
          </motion.h1>
        </div>
      </motion.div>

      <hr className="my-8" />

      {/* Intro section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Avatar + Resume */}
        <motion.div
          className="min-w-48 max-w-48 flex flex-col gap-2 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <Avatar className="h-48 w-48">
            <AvatarImage src="/images/profile.jpg" alt={siteConfig.author} />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-center break-words">
            {siteConfig.author}
          </h2>
          <p className="text-muted-foreground text-center break-words">
            Senior Software Engineer
          </p>
          <Link
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-fit flex gap-2 items-center mt-8"
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

        {/* Bio */}
        <motion.div
          className="text-muted-foreground text-lg py-4 text-justify space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <p>
            I’m <strong>Anastasios Theodosiou</strong>, a{" "}
            <strong>Senior Angular Engineer</strong> with over{" "}
            <strong>8 years of experience</strong> building high-performance,
            enterprise-scale web platforms across{" "}
            <strong>finance, banking, and public sectors</strong>. I come from{" "}
            <a
              href={siteConfig.placeOfBirth}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              Alexandroupolis, Evrou, GR
            </a>{" "}
            but since 2017 I’ve been living and working in{" "}
            <a
              href={siteConfig.placeOfWork}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              Thessaloniki, GR
            </a>
            .
          </p>

          <p>
            My main focus is <strong>frontend architecture</strong> and{" "}
            <strong>performance engineering</strong>, and I specialize in
            crafting scalable, maintainable <strong>Angular</strong>{" "}
            applications that bridge the gap between frontend and backend
            systems. I’m passionate about clean architectures and reusable UI
            systems that make teams faster and products more consistent.
          </p>

          <p>
            At{" "}
            <a
              href={siteConfig.links.arhsHellas}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              Arhs Developments Hellas
            </a>
            , I lead the frontend of a large-scale corporate e-banking platform,
            driving a full redesign in <strong>Angular 19</strong> that improved
            performance, accessibility, and design consistency through a shared
            component library. Previously, I contributed to the{" "}
            <strong>EU Customs Risk Management System</strong> at{" "}
            <strong>Netcompany–Intrasoft</strong>, delivering complex data
            dashboards and improving maintainability across teams.
          </p>

          <p>
            Beyond enterprise work, I enjoy building full-stack
            projects with <strong>Angular</strong>, <strong>NestJS</strong>, and{" "}
            <strong>MongoDB</strong>.
          </p>
          <p>
            I’m driven by technical excellence, collaboration, and mentoring,
            helping teams grow while keeping software performant, testable, and
            future-proof. When I’m not coding, I love writing about what I
            learn, experimenting with new frameworks, and exploring ways to push
            the limits of modern web development.
          </p>
        </motion.div>
      </div>

      <hr className="my-8" />

      {/* Work Experience */}
      <motion.h1
        className="text-4xl font-bold text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        Work Experience
      </motion.h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <Timeline items={timelineItems} />
      </motion.div>

      <hr className="my-8" />

      {/* Education */}
      <motion.h1
        className="text-4xl font-bold text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        Education
      </motion.h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <Timeline items={educationItems} />
      </motion.div>
    </div>
  );
}
