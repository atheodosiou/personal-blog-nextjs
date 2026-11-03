const technologies = [
  { name: "Angular", icon: "angular", specialization: true },
  { name: "NestJS", icon: "nestjs", specialization: true },
  { name: "MongoDB", icon: "mongodb", specialization: true },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Docker", icon: "docker" },
];

export function TechnologyStack() {
  return (
    <section
      id="stack"
      className="stack-section shell section-space"
      aria-labelledby="stack-title"
    >
      <div className="section-heading" data-reveal>
        <h2 id="stack-title">The tools behind the work.</h2>
        <p>Angular, NestJS, and MongoDB at the core.</p>
      </div>
      <ul className="technology-list" aria-label="Technologies I work with">
        {technologies.map(({ name, icon, specialization }) => (
          <li
            key={icon}
            className={specialization ? "technology-specialization" : undefined}
            data-reveal
          >
            <span
              className="technology-logo"
              style={{
                maskImage: `url(/icons/stack/${icon}.svg)`,
                WebkitMaskImage: `url(/icons/stack/${icon}.svg)`,
              }}
              aria-hidden="true"
            />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
