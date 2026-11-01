export function PolicyLayout({ title, intro, children }: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <header className="page-intro"><h1>{title}</h1><p>{intro}</p></header>
      <article className="legal-content">
        <p className="legal-updated">Last updated: <time dateTime="2026-11-01">1 November 2026</time></p>
        {children}
      </article>
    </div>
  );
}
