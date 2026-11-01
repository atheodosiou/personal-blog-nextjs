// Curated topic guides are search landing pages. The remaining tags stay useful
// for browsing, but do not create dozens of near-identical indexable archives.
export const topicGuides: Record<
  string,
  { title: string; introduction: string; project: string; projectLabel: string }
> = {
  angular: {
    title: "Angular",
    introduction:
      "Angular is my main specialization. These articles cover change detection, template features, type safety and application architecture, drawing on enterprise frontend work and the developer tools I build independently.",
    project: "/projects/xlf-sync",
    projectLabel: "Explore xlf-sync, my Angular i18n tool",
  },
  typescript: {
    title: "TypeScript",
    introduction:
      "TypeScript helps make application contracts explicit, from exhaustive handling of frontend state to typed APIs. Here I share practical approaches to type safety, alongside a full-stack project built with TypeScript across its application and backend.",
    project: "/projects/study-workspace",
    projectLabel: "See TypeScript across Study Workspace",
  },
  nestjs: {
    title: "NestJS",
    introduction:
      "In Study Workspace, NestJS owns authorization, exam timing and grading behind a stable application API. This topic connects the implementation story with the backend boundaries, persistence and delivery choices behind the live platform.",
    project: "/projects/study-workspace",
    projectLabel: "Explore the Study Workspace architecture",
  },
  "front-end-architecture": {
    title: "Frontend architecture",
    introduction:
      "Frontend architecture connects component boundaries, state management, testing and delivery. My writing explores those decisions in Angular applications, while my independent projects show how frontend choices interact with APIs and production operations.",
    project: "/projects/study-workspace",
    projectLabel: "See a complete application architecture",
  },
  i18n: {
    title: "Internationalization",
    introduction:
      "Internationalization is an ongoing workflow after the first extraction of messages. My work on xlf-sync focuses on keeping Angular XLIFF files current while retaining translated text, translator notes and the metadata teams need to maintain multiple locales.",
    project: "/projects/xlf-sync",
    projectLabel: "Explore the xlf-sync case study",
  },
};
