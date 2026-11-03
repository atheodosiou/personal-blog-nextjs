import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/config/projects";
import { absoluteUrl, pageMetadata, websiteId } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata = pageMetadata({
  title: "Software engineering projects | Anastasios Theodosiou",
  description:
    "Explore Study Workspace and xlf-sync: full-stack application architecture, Angular developer tooling, backend decisions and production delivery by Anastasios Theodosiou.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="shell">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: absoluteUrl("/projects"),
          name: "Software engineering projects",
          isPartOf: { "@id": websiteId },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.name,
              url: absoluteUrl(`/projects/${project.slug}`),
            })),
          },
        }}
      />
      <header className="page-intro projects-intro">
        <h1>Software projects.</h1>
        <p>
          The problems, implementation choices and delivery behind two of my
          projects.
        </p>
      </header>
      {projects.map((project, index) => (
        <article className="featured-project case-preview" key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className="project-visual"
            data-reveal
            aria-label={`Explore ${project.name} case study`}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(max-width: 900px) 100vw, 60vw"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </Link>
          <div className="project-copy">
            <h2 data-reveal>{project.name}</h2>
            <p data-reveal>{project.intro}</p>
            <p data-reveal>{project.stack}</p>
            <Link href={`/projects/${project.slug}`} className="text-link" data-reveal>
              Explore the case study <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
      <Link href="/#work" className="text-link">
        More selected work <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}
