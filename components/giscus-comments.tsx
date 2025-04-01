"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
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
      theme="dark"
      lang="en"
      loading="lazy"
    />
  );
}
