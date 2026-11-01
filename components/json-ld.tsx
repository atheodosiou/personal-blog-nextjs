export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Content/frontmatter must never be able to terminate the script tag.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
