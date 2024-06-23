import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig, workExperienceAndEducationInfo } from "@/config/site";
import { Metadata } from "next";
import Timeline, { TimelineItem } from "@/components/work-timeline";

export const metadata: Metadata = {
  title: "About Me",
  description: "Information about me",
};

export default async function AboutPage() {
  const timelineItems = workExperienceAndEducationInfo.experience;
  const educationItems = workExperienceAndEducationInfo.education;
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-x-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">
            About Me
          </h1>
        </div>
      </div>
      <hr className="my-8" />
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="min-w-48 max-w-48 flex flex-col gap-2">
          <Avatar className="h-48 w-48">
            <AvatarImage src="/avatar.jpeg" alt={siteConfig.author} />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-center break-words">
            {siteConfig.author}
          </h2>
          <p className="text-muted-foreground text-center break-words">
            Senior Software Engineer
          </p>
        </div>
        <p className="text-muted-foreground text-lg py-4 text-justify">
          I’m Anastasios, a software engineer and creative coder who has a
          passion for the front-end spectrum. <br />I come from{" "}
          <a
            href={siteConfig.placeOfBirth}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            Alexandroupolis, Evrou
          </a>
          , GR but since 2017 I live and work in{" "}
          <a
            href={siteConfig.placeOfWork}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            Thessaloniki, GR
          </a>
          . <br />
          I love creating web applications, especialy using Angular 2+. I also
          deal with some back-end technologies like, Node.js ,Express, NestJS
          and MongoDB. <br />
          I specialize in front-end development and make it my mission to
          translate user-focussed designs into pixel-perfect websites or
          applications that run blazing fast. <br />
          I’m currently part of the team at{" "}
          <a
            href={siteConfig.links.arhsHellas}
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            Arhs Developments Hellas
          </a>{" "}
          as a Senior Frontend Engineer, where I help to architect, design, and
          built some of the largest and most complex IT systems in the European
          Commission and in Greek public/private sectors. <br />I always like
          learning new things and often write about my findings on my blog.
        </p>
      </div>
      <hr className="my-8" />
      <h1 className="text-4xl font-bold text-center">Work Experience</h1>
      <Timeline items={timelineItems} />
      <hr className="my-8" />
      <h1 className="text-4xl font-bold text-center">Education</h1>
      <Timeline items={educationItems} />
    </div>
  );
}
