import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig, workExperienceAndEducationInfo } from "@/config/site";
import Timeline from "@/components/work-timeline";
import portrait from "@/public/images/profile.jpg";

export const metadata: Metadata = {
  title: "About | Anastasios Theodosiou",
  description:
    "Senior frontend engineer based in Thessaloniki, working on Angular architecture, performance, and developer tooling.",
};

const careerSummaries = [
  "Frontend architecture, reusable UI systems, and performance engineering for enterprise platforms. Technical guidance, code reviews, and collaboration across frontend and backend teams.",
  "Frontend development for European Union platforms, including the Customs Risk Management System, with complex data dashboards and shared engineering practices.",
  "Angular applications for public hospitals in Greece. Reusable components, frontend development processes, and modernization of existing healthcare systems.",
  "Web application development with JavaScript, Angular, Node.js, Express, and MongoDB.",
];
const educationSummaries = [
  "MSc in Data and Web Science. Thesis on distributed link prediction in large-scale graphs using Apache Spark and Scala. Grade: 9.3/10.",
  "BSc in Computer Science and Telecommunications. Thesis on fuelGR, a map-based application for Greek fuel prices and station discovery. Grade: 7.66/10.",
];

export default function AboutPage() {
  return (
    <div className="shell">
      <header className="page-intro">
        <h1>About the engineer.</h1>
        <p>
          Architecture, thoughtful interfaces, and software that teams can keep
          building on.
        </p>
      </header>
      <div className="about-lead">
        <div className="about-identity" data-reveal>
          <Image
            src={portrait}
            alt="Anastasios Theodosiou"
            className="about-portrait"
            sizes="(max-width: 700px) 110px, 240px"
            priority
          />
          <div className="about-facts">
            <span>Anastasios Theodosiou</span>
            <span>Thessaloniki, Greece</span>
            <span>Senior Frontend Engineer</span>
          </div>
        </div>
        <div className="about-story" data-reveal>
          <p>
            I build Angular applications and developer tools, with a focus on
            frontend architecture, performance, and maintainability.
          </p>
          <p>
            My work spans enterprise platforms in banking, the public sector,
            and healthcare. I care about reusable UI systems, clear technical
            decisions, and helping teams deliver consistent software.
          </p>
          <p>
            Alongside enterprise work, I build personal products and tools such
            as Availo, Capmentor, and xlf-sync. Writing about the problems I
            encounter is part of how I make sense of the work.
          </p>
          <div className="project-links">
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noreferrer"
              className="primary-action"
            >
              Download résumé <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Connect on LinkedIn <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <section
        className="career-section section-space"
        aria-labelledby="career-title"
      >
        <h2 id="career-title" data-reveal>
          Experience
        </h2>
        <Timeline
          items={workExperienceAndEducationInfo.experience.map(
            (item, index) => ({ ...item, summary: careerSummaries[index] }),
          )}
        />
      </section>
      <section
        className="career-section section-space"
        aria-labelledby="education-title"
      >
        <h2 id="education-title" data-reveal>
          Education
        </h2>
        <Timeline
          items={workExperienceAndEducationInfo.education.map(
            (item, index) => ({
              ...item,
              title: index === 0 ? "Aristotle University" : "TEI of Thessaly",
              summary: educationSummaries[index],
            }),
          )}
        />
      </section>
    </div>
  );
}
