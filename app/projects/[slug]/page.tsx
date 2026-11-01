import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, projects } from "@/config/projects";
import { JsonLd } from "@/components/json-ld";
import { SyncExample } from "@/components/sync-example";
import {
  absoluteUrl,
  breadcrumbSchema,
  pageMetadata,
  personId,
  websiteId,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () =>
  projects.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return pageMetadata({
    title: `${project.title} | Anastasios Theodosiou`,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image,
    imageAlt: project.imageAlt,
  });
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const other = projects.find((item) => item.slug !== project.slug)!;
  return (
    <div className="shell case-study">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.name, path: `/projects/${project.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": absoluteUrl(`/projects/${project.slug}#page`),
          url: absoluteUrl(`/projects/${project.slug}`),
          name: project.title,
          description: project.description,
          inLanguage: "en",
          isPartOf: { "@id": websiteId },
          author: { "@id": personId },
          primaryImageOfPage: absoluteUrl(project.image),
          mainEntity: {
            "@type": "SoftwareSourceCode",
            name: project.name,
            codeRepository: project.repository,
            author: { "@id": personId },
            description: project.intro,
          },
        }}
      />
      <header className="page-intro case-intro">
        <nav aria-label="Breadcrumb">
          <Link href="/projects">Projects</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{project.name}</span>
        </nav>
        <h1>{project.name}</h1>
        <p>{project.intro}</p>
        <div className="project-links">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {link.label} <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </header>
      <figure className="case-image" data-reveal>
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={project.imageWidth}
          height={project.imageHeight}
          sizes="(max-width: 700px) 100vw, 92vw"
          preload
        />
        <figcaption>{project.stack}</figcaption>
      </figure>
      <section className="case-section" aria-labelledby="problem-title">
        <h2 id="problem-title" data-reveal>
          The problem
        </h2>
        <div data-reveal>
          <p>{project.problem}</p>
          <h3>My contribution</h3>
          <p>{project.contribution}</p>
        </div>
      </section>
      <section className="case-decisions" aria-labelledby="decisions-title">
        <h2 id="decisions-title" data-reveal>
          Engineering decisions
        </h2>
        <div>
          {project.decisions.map((decision) => (
            <article key={decision.title} data-reveal>
              <h3>{decision.title}</h3>
              <p>{decision.text}</p>
            </article>
          ))}
        </div>
        {project.slug === "xlf-sync" && (
          <div className="case-live" data-reveal>
            <SyncExample />
          </div>
        )}
      </section>
      <figure className="case-evidence" data-reveal>
        <Image
          src={project.detailImage}
          alt={project.detailAlt}
          width={project.detailWidth}
          height={project.detailHeight}
          sizes="(max-width: 700px) 100vw, 92vw"
        />
        <figcaption>{project.detailCaption}</figcaption>
      </figure>
      <section className="case-section" aria-labelledby="delivery-title">
        <h2 id="delivery-title" data-reveal>
          Delivery and outcome
        </h2>
        <div data-reveal>
          <p>{project.delivery}</p>
          <p>{project.result}</p>
        </div>
      </section>
      <section className="case-section" aria-labelledby="further-title">
        <h2 id="further-title" data-reveal>
          Further reading
        </h2>
        <div className="case-reading" data-reveal>
          <Link href={project.article.href} className="text-link">
            {project.article.label} <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href={`/projects/${other.slug}`} className="case-related">
            <Image
              src={other.image}
              alt={other.imageAlt}
              width={other.imageWidth}
              height={other.imageHeight}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span className="text-link">
              Explore {other.name} <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
          <div className="topic-list">
            {project.topics.map((topic) => (
              <Link href={topic.href} key={topic.href}>
                {topic.label}
              </Link>
            ))}
          </div>
          <Link href="/about" className="text-link">
            About my engineering experience{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
