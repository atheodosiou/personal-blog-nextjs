"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

export function SyncExample() {
  const [synced, setSynced] = useState(false);
  return (
    <details className="sync-example">
      <summary>
        Explore a sync example <Plus size={18} aria-hidden="true" />
      </summary>
      <div className="sync-example-content">
        <p>
          A source file gains a new “Book appointment” message. The existing
          Greek translation and translator note stay intact.
        </p>
        <div className="sync-controls">
          <span id="sync-file-label">
            messages.el.xlf · {synced ? "after sync" : "before sync"}
          </span>
          <button
            type="button"
            aria-pressed={synced}
            aria-controls="sync-code"
            onClick={() => setSynced(!synced)}
          >
            {synced ? "Show original" : "Show synced file"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <pre id="sync-code" aria-labelledby="sync-file-label" tabIndex={0}>
          <code>{`<trans-unit id="welcome" approved="yes">\n  <source>Welcome</source>\n  <target>Καλώς ήρθατε</target>\n  <note>Keep the friendly tone.</note>\n</trans-unit>${synced ? '\n\n<trans-unit id="book">\n  <source>Book appointment</source>\n  <target state="new"></target>\n</trans-unit>' : ""}`}</code>
        </pre>
        <p className="sync-caption" role="status">
          {synced
            ? "Existing translation preserved. New message ready to translate."
            : "Illustrative XLIFF 1.2 excerpt. Select “Show synced file” to compare."}
        </p>
      </div>
    </details>
  );
}
