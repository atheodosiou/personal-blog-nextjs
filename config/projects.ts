export const projects = [
  {
    slug: "study-workspace",
    name: "Study Workspace",
    title: "Study Workspace: full-stack case study",
    description:
      "A full-stack certification practice platform built by Anastasios Theodosiou with Expo, NestJS, Prisma and PostgreSQL. Explore its architecture, exam integrity and deployment decisions.",
    intro:
      "A certification practice platform built around focused study, server-timed exams and progress that survives the next session.",
    image: "/images/projects/study-workspace.png",
    imageAlt:
      "Study Workspace practice question, answer explanations and course catalog",
    imageWidth: 3200,
    imageHeight: 1800,
    detailImage: "/images/projects/study-workspace-catalog.png",
    detailWidth: 1920,
    detailHeight: 855,
    detailAlt:
      "Study Workspace public course catalog with certification providers and course cards in the creator view",
    detailCaption:
      "The public course catalog, shown from the creator account, brings course discovery and provider filters into one screen.",
    stack:
      "Expo · React Native Web · TypeScript · NestJS · Prisma · PostgreSQL · Supabase · Docker",
    repository: "https://github.com/atheodosiou/study-workplace",
    links: [
      { label: "Try Study Workspace", href: "https://study-workplace.theodosiou.me" },
      {
        label: "Web app source",
        href: "https://github.com/atheodosiou/study-workplace",
      },
      {
        label: "API source",
        href: "https://github.com/atheodosiou/study-workspace-api",
      },
    ],
    problem:
      "Markdown question banks are useful source material, but they expose answers too early and make it difficult to resume practice or review mistakes. I wanted a phone-friendly study session and a timed exam with rules that remain consistent when a learner closes a tab.",
    contribution:
      "I defined the requirements, selected the stack, designed the data model and API, built the application and documented deployment and rollback. The initial courses use attributed, MIT-licensed material from CloudCertPrep; course creators can also write questions or import their own JSON question banks.",
    decisions: [
      {
        title: "The server owns the exam",
        text: "NestJS controls deadlines, grading and submission. Closing the app does not pause an exam. Correct answers stay on the server until the learner checks a study answer or submits an exam.",
      },
      {
        title: "Progress keeps its meaning",
        text: "Accuracy uses the first answer to each question. Edited questions create new versions, so an existing response remains tied to the question the learner actually saw.",
      },
      {
        title: "One application boundary",
        text: "The Expo web application calls a NestJS API. Supabase handles sign-in and hosted PostgreSQL, while Prisma accesses application data through the API. Authorization and exam rules live in the backend.",
      },
    ],
    delivery:
      "API end-to-end tests apply the real migrations to PGlite, with the authentication token check mocked. Vitest, type checks and linting support delivery. Nginx serves the exported web app and forwards API requests to a non-root Docker container on loopback. Frontend releases use commit-named folders and an atomic symlink switch for rollback.",
    result:
      "The web application is live in English and Greek, with study and exam modes, saved progress, course creation and imports. Native iOS and Android releases and further deployment automation are planned work.",
    article: {
      href: "/blog/building-study-workspace-certification-practice-app",
      label: "Read the story behind Study Workspace",
    },
    topics: [
      { href: "/tags/nestjs", label: "NestJS" },
      { href: "/tags/typescript", label: "TypeScript" },
    ],
  },
  {
    slug: "xlf-sync",
    name: "xlf-sync",
    title: "xlf-sync: Angular i18n CLI",
    description:
      "Anastasios Theodosiou's Angular i18n CLI for synchronizing XLIFF files while preserving translations, notes and metadata, with translation coverage reports and CI checks.",
    intro:
      "An Angular i18n command-line tool that keeps XLIFF files synchronized while preserving the work inside them.",
    image:
      "/images/articles/the-missing-piece-in-angular-i18n/landing_page.png",
    imageAlt:
      "xlf-sync documentation for the Angular translation synchronization workflow",
    imageWidth: 1902,
    imageHeight: 945,
    detailImage: "/images/projects/xlf-sync-commands.png",
    detailWidth: 1905,
    detailHeight: 848,
    detailAlt:
      "xlf-sync documentation showing sync, check, report and dashboard commands",
    detailCaption:
      "The public documentation connects local synchronization, CI checks and translation coverage reports.",
    stack:
      "Angular i18n · XLIFF 1.2 and 2.0 · Command-line tooling · CI checks",
    repository: "https://github.com/atheodosiou/xlf-sync",
    links: [
      {
        label: "Read the documentation",
        href: "https://atheodosiou.github.io/xlf-sync/",
      },
      { label: "Source code", href: "https://github.com/atheodosiou/xlf-sync" },
      { label: "View on npm", href: "https://www.npmjs.com/package/xlf-sync" },
    ],
    problem:
      "Angular extracts source messages, but teams still need to carry those changes into locale files. Those files contain translated text, approval states, translator notes and tool-specific metadata. Recreating them can discard information that the application team does not own.",
    contribution:
      "I built xlf-sync around preserving existing translation units and making source changes visible. The project includes the CLI, public documentation, a translation coverage dashboard and commands that can be used as CI checks.",
    decisions: [
      {
        title: "Preserve existing units",
        text: "The source file defines which message identifiers exist. Locale files retain their translations, notes and metadata. Existing units are preserved instead of rebuilt from a simplified key-value representation.",
      },
      {
        title: "Make removal deliberate",
        text: "A removed source key does not automatically erase translation history. Obsolete entries can be marked, moved to a graveyard file or explicitly deleted according to the team's workflow.",
      },
      {
        title: "Make coverage visible",
        text: "A standalone HTML dashboard shows translation coverage across locales. The check command makes missing or drifting translations visible in CI, alongside the same feedback developers use locally.",
      },
    ],
    delivery:
      "The tool supports XLIFF 1.2 and 2.0, including projects that contain both formats. It is published on npm, with its source available on GitHub and documentation on GitHub Pages. The static coverage report can be shared or retained as a CI artifact.",
    result:
      "Angular teams can synchronize source changes while keeping translation state and context. The public package and documentation provide a concrete example of my Angular specialization and the tooling I build around application delivery.",
    article: {
      href: "/blog/the-missing-piece-in-angular-i18n",
      label: "Read the Angular i18n engineering article",
    },
    topics: [
      { href: "/tags/angular", label: "Angular" },
      { href: "/tags/i18n", label: "Internationalization" },
    ],
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
