import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbSchema, pageMetadata, personId, websiteId } from "@/lib/seo";
import { siteConfig, workExperienceAndEducationInfo } from "@/config/site";
import Timeline from "@/components/work-timeline";
import portrait from "@/public/images/profile.jpg";

export const metadata = pageMetadata({
  title: "About | Anastasios Theodosiou",
  description:
    "Full-stack software engineer based in Thessaloniki, building JavaScript and TypeScript applications with a specialization in Angular.",
  path: "/about",
});

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

const engineeringAreas = [
  {
    title: "Frontend engineering",
    description:
      "Angular, React, Next.js, Expo, TypeScript, HTML, CSS/SCSS, and Tailwind. Responsive interfaces, accessibility, and performance.",
  },
  {
    title: "Frontend architecture",
    description:
      "Reusable components and design systems, RxJS, NgRx, Angular Signals, and Nx monorepos.",
  },
  {
    title: "Backend engineering",
    description:
      "Node.js, NestJS, Express, REST APIs, authentication and authorization, PostgreSQL, MongoDB, and Prisma.",
  },
  {
    title: "Testing and delivery",
    description:
      "Automated testing with Jest, Vitest, Cypress, and Playwright. Git, Docker, CI/CD, and production deployment.",
  },
];

export default function AboutPage() {
  return (
    <div className="shell">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": absoluteUrl("/about#webpage"),
        url: absoluteUrl("/about"),
        name: `About ${siteConfig.name}`,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        inLanguage: "en",
      }} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ])} />
      <header className="page-intro">
        <h1>About the engineer.</h1>
        <p>
          Frontend and backend engineering with JavaScript and TypeScript, with
          a specialization in Angular.
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
            <span>{siteConfig.role}</span>
          </div>
        </div>
        <div className="about-story" data-reveal>
          <p>
            I&apos;m a software engineer working across frontend and backend
            development with JavaScript and TypeScript. My experience spans
            enterprise applications in banking, the public sector, and
            healthcare, alongside products and developer tools I build
            independently.
          </p>
          <p>
            Angular is my main specialization, with experience in frontend
            architecture, reactive state management, reusable UI systems,
            accessibility, and performance. I also work with React, Next.js, and
            Expo, choosing technologies around the needs of each product.
          </p>
          <p>
            On the backend, I build APIs and application services with Node.js,
            NestJS, and Express, working with PostgreSQL, MongoDB, and Prisma.
            My work includes data modelling, authentication, authorization,
            business logic, and automated testing.
          </p>
          <p>
            I take projects through requirements, implementation, testing, and
            deployment. Products such as Study Workspace and tools like
            xlf-sync reflect how I approach engineering: understand the problem,
            make clear technical decisions, and build something useful.
          </p>
          <p>
            I&apos;m based in Thessaloniki, Greece, and hold an MSc in Data and
            Web Science from Aristotle University of Thessaloniki.
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
        aria-labelledby="toolkit-title"
      >
        <h2 id="toolkit-title" data-reveal>
          Engineering toolkit
        </h2>
        <div className="engineering-areas">
          {engineeringAreas.map((area) => (
            <div className="engineering-area" key={area.title} data-reveal>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>
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
