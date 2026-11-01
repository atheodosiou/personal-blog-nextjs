"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  if (!enabled) return (
    <div className="comments-placeholder">
      <p>Comments are hosted by Giscus and GitHub. Load them when you want to read or join the discussion.</p>
      <button type="button" className="primary-action" onClick={() => setEnabled(true)}>Load comments</button>
    </div>
  );
  return (
    <Giscus
      id="comments"
      repo="atheodosiou/personal-blog-nextjs"
      repoId="R_kgDOMLLKiQ"
      category="General"
      categoryId="DIC_kwDOMLLKic4Cors0"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      lang="en"
      loading="lazy"
    />
  );
}
