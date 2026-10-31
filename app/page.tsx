import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { SyncExample } from "@/components/sync-example";
import { siteConfig } from "@/config/site";
import { sortPosts } from "@/lib/utils";
import availo from "@/public/images/projects/availo_gr.png";
import xlfSync from "@/public/images/articles/the-missing-piece-in-angular-i18n/landing_page.png";
import capmentor from "@/public/images/projects/capmentor.png";
import officerTest from "@/public/images/projects/engineerofficertest.png";
import studyWorkspace from "@/public/images/projects/study-workspace.png";

export default function Home() {
  const latestPosts = sortPosts(posts.filter((post) => post.published)).slice(
    0,
    2,
  );
  return (
    <>
      <section className="hero shell" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-title">
          <span>Senior frontend</span>
          <span>engineer.</span>
        </h1>
        <div className="hero-bottom">
          <div className="hero-intro">
            <p>
              I&apos;m Anastasios Theodosiou. I build Angular platforms and
              developer tools, with a focus on architecture, performance, and
              maintainability.
            </p>
            <p className="hero-location">Based in Thessaloniki, Greece.</p>
          </div>
          <div className="hero-actions">
            <Link href="#work" className="primary-action">
              View selected work <ArrowDown size={18} aria-hidden="true" />
            </Link>
            <a href={`mailto:${siteConfig.email}`} className="text-link">
              Get in touch <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="work-section shell section-space"
        aria-labelledby="work-title"
      >
        <div className="section-heading" data-reveal>
          <h2 id="work-title">Selected work</h2>
          <p>Products and tools built around real problems.</p>
        </div>
        <article className="featured-project tool-project">
          <div className="project-copy" data-reveal>
            <h3>Study Workspace</h3>
            <p className="project-category">Certification practice platform</p>
            <p className="project-statement">
              A better place to prepare.
            </p>
            <p>
              A free study platform that turns question banks into focused
              practice, timed exams, and progress you can pick up from your
              phone or the couch. Available in English and Greek.
            </p>
            <dl className="project-facts">
              <div>
                <dt>The stack</dt>
                <dd>
                  Expo, React Native, TypeScript, NestJS, Prisma, PostgreSQL,
                  Supabase, and Docker.
                </dd>
              </div>
              <div>
                <dt>The decision</dt>
                <dd>
                  Keep exam timing and grading on the server, with answer
                  explanations and first-attempt accuracy guiding practice.
                </dd>
              </div>
            </dl>
            <div className="project-links">
              <a
                href="https://study.theodosiou.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Try Study Workspace <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <Link
                href="/blog/building-study-workspace-certification-practice-app"
                className="text-link"
              >
                Read the story <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/atheodosiou/study-workplace"
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-link"
              >
                Source code
              </a>
            </div>
          </div>
          <div className="tool-visual" data-reveal>
            <a
              href="https://study.theodosiou.me"
              target="_blank"
              rel="noopener noreferrer"
              className="project-visual"
              aria-label="Explore Study Workspace certification practice platform"
            >
              <Image
                src={studyWorkspace}
                alt="Study Workspace with a practice question, answer explanations, and a certification course catalog"
                sizes="(max-width: 900px) 100vw, 60vw"
                quality={90}
                className="project-image"
              />
              <span className="image-action" aria-hidden="true">
                <ArrowUpRight size={24} />
              </span>
            </a>
          </div>
        </article>

        <article className="featured-project">
          <a
            href="https://availo.gr"
            target="_blank"
            rel="noreferrer"
            className="project-visual availo-visual"
            data-reveal
            aria-label="Explore Availo booking platform"
          >
            <Image
              src={availo}
              alt="Availo's booking platform, showing its calendar and appointment interface"
              sizes="(max-width: 900px) 100vw, 65vw"
              quality={90}
              className="project-image"
            />
            <span className="image-action" aria-hidden="true">
              <ArrowUpRight size={24} />
            </span>
          </a>
          <div className="project-copy" data-reveal>
            <h3>Availo</h3>
            <p className="project-category">Booking platform</p>
            <p className="project-statement">
              Bookings, without the back-and-forth.
            </p>
            <p>
              Online bookings and appointment management for service
              professionals, brought together in one B2B SaaS platform.
            </p>
            <dl className="project-facts">
              <div>
                <dt>The problem</dt>
                <dd>
                  Managing availability and appointments across a working day.
                </dd>
              </div>
              <div>
                <dt>The product</dt>
                <dd>
                  A dedicated place to organize bookings and keep the schedule
                  in view.
                </dd>
              </div>
            </dl>
            <a
              href="https://availo.gr"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Explore Availo <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className="featured-project tool-project">
          <div className="project-copy" data-reveal>
            <h3>xlf-sync</h3>
            <p className="project-category">Angular developer tooling</p>
            <p className="project-statement">Translation work, preserved.</p>
            <p>
              A command-line tool that keeps Angular&apos;s XLIFF files in sync
              while preserving translations, notes, and metadata.
            </p>
            <dl className="project-facts">
              <div>
                <dt>The decision</dt>
                <dd>
                  Preserve existing translation units instead of rebuilding
                  them.
                </dd>
              </div>
              <div>
                <dt>The result</dt>
                <dd>
                  New source strings can be added without discarding a
                  translator&apos;s work.
                </dd>
              </div>
            </dl>
            <div className="project-links">
              <a
                href="https://atheodosiou.github.io/xlf-sync/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Read the docs <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/atheodosiou/xlf-sync"
                target="_blank"
                rel="noreferrer"
                className="quiet-link"
              >
                Source code
              </a>
              <a
                href="https://www.npmjs.com/package/xlf-sync"
                target="_blank"
                rel="noreferrer"
                className="quiet-link"
              >
                npm
              </a>
            </div>
            <SyncExample />
          </div>
          <div className="tool-visual" data-reveal>
            <a
              href="https://atheodosiou.github.io/xlf-sync/"
              target="_blank"
              rel="noreferrer"
              className="project-visual"
              aria-label="Explore xlf-sync documentation"
            >
              <Image
                src={xlfSync}
                alt="xlf-sync documentation and translation synchronization workflow"
                sizes="(max-width: 900px) 100vw, 60vw"
                className="project-image"
              />
            </a>
          </div>
        </article>

        <div className="supporting-projects">
          <article data-reveal>
            <a
              href="https://capmentor.com"
              target="_blank"
              rel="noreferrer"
              className="project-visual"
              aria-label="Open Capmentor compound interest calculator"
            >
              <Image
                src={capmentor}
                alt="Capmentor's compound interest calculator with a growth chart"
                sizes="(max-width: 700px) 100vw, 50vw"
                className="project-image"
              />
              <span className="image-action" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </a>
            <div className="supporting-copy">
              <h3>Capmentor</h3>
              <p>
                A compound interest calculator that makes long-term growth
                easier to explore.
              </p>
              <div className="project-links">
                <a
                  href="https://capmentor.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Explore the calculator{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/atheodosiou/capmentor.com"
                  target="_blank"
                  rel="noreferrer"
                  className="quiet-link"
                >
                  Source code
                </a>
              </div>
            </div>
          </article>
          <article data-reveal>
            <a
              href="https://engineerofficertest.com"
              target="_blank"
              rel="noreferrer"
              className="project-visual"
              aria-label="Open Engineer Officer Test"
            >
              <Image
                src={officerTest}
                alt="Engineer Officer Test, a marine exam preparation platform"
                sizes="(max-width: 700px) 100vw, 50vw"
                className="project-image"
              />
              <span className="image-action" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </a>
            <div className="supporting-copy">
              <h3>Engineer Officer Test</h3>
              <p>
                A dedicated exam preparation platform for marine engineers and
                officers.
              </p>
              <a
                href="https://engineerofficertest.com"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                View the platform <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="text-link work-archive"
          data-reveal
        >
          More experiments on GitHub{" "}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section
        className="experience-band section-space"
        aria-labelledby="experience-title"
      >
        <div className="shell experience-grid">
          <div data-reveal>
            <h2 id="experience-title">
              Experience that
              <br className="desktop-break" /> shapes the work.
            </h2>
            <Link href="/about" className="text-link">
              A little more about me <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="experience-content">
            <p className="experience-intro" data-reveal>
              From public-sector platforms to corporate banking, my work centers
              on maintainable interfaces and the teams that build them.
            </p>
            <div className="experience-row" data-reveal>
              <div>
                <h3>ARHS Developments Hellas</h3>
                <p>Senior Front-End Engineer</p>
              </div>
              <span>2022 — present</span>
            </div>
            <div className="experience-row" data-reveal>
              <div>
                <h3>Netcompany–Intrasoft</h3>
                <p>Senior Front-End Developer</p>
              </div>
              <span>2020 — 2022</span>
            </div>
            <div className="experience-row" data-reveal>
              <div>
                <h3>OR-CO</h3>
                <p>Front-End Developer · Healthcare</p>
              </div>
              <span>2018 — 2020</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="writing"
        className="shell writing-section section-space"
        aria-labelledby="writing-title"
      >
        <div className="section-heading" data-reveal>
          <div>
            <h2 id="writing-title">Writing from practice</h2>
            <p>Notes on Angular, architecture, and the details that matter.</p>
          </div>
          <Link href="/blog" className="text-link">
            All articles <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="article-list">
          {latestPosts.map((post) => (
            <div key={post.slug} data-reveal>
              <PostItem {...post} compact />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
