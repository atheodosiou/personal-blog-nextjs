"use client";

import { useRef, useState, type ComponentType } from "react";
import { MobileNavTrigger, ThemeTrigger } from "./header-control-triggers";

export type HeaderControl = "theme" | "navigation";
export type HeaderControlsProps = {
  initialControl: HeaderControl;
  focusThemeItem: boolean;
};

const loadControls = () => import("./interactive-header-controls");
const preloadControls = () => { void loadControls().catch(() => {}); };

export function HeaderControls() {
  const requestId = useRef(0);
  const [loaded, setLoaded] = useState<{
    Component: ComponentType<HeaderControlsProps>;
    initialControl: HeaderControl;
    focusThemeItem: boolean;
  } | null>(null);
  const [pending, setPending] = useState<HeaderControl | null>(null);
  const [error, setError] = useState(false);

  function cancelPending() {
    requestId.current += 1;
    setPending(null);
  }

  async function open(control: HeaderControl, focusThemeItem = false) {
    const request = ++requestId.current;
    setError(false);
    setPending(control);
    try {
      const { InteractiveHeaderControls } = await loadControls();
      if (request !== requestId.current) return;
      setLoaded({ Component: InteractiveHeaderControls, initialControl: control, focusThemeItem });
      setPending(null);
    } catch {
      if (request !== requestId.current) return;
      setPending(null);
      setError(true);
    }
  }

  const Controls = loaded?.Component;
  return (
    <div
      className="header-controls"
      onPointerEnter={preloadControls}
      onFocus={preloadControls}
      onBlur={(event) => {
        if (pending && !event.currentTarget.contains(event.relatedTarget)) cancelPending();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && pending) cancelPending();
      }}
    >
      {Controls && loaded ? (
        <Controls initialControl={loaded.initialControl} focusThemeItem={loaded.focusThemeItem} />
      ) : (
        <>
          <ThemeTrigger
            aria-haspopup="menu"
            aria-expanded={false}
            aria-busy={pending === "theme" || undefined}
            onClick={(event) => void open("theme", event.detail === 0)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                void open("theme", true);
              }
            }}
          />
          <MobileNavTrigger
            aria-haspopup="dialog"
            aria-expanded={false}
            aria-busy={pending === "navigation" || undefined}
            onClick={() => void open("navigation")}
          />
        </>
      )}
      <span className="sr-only" role="status">
        {error ? "The menu could not open. Please try again." : pending ? "Opening menu…" : ""}
      </span>
    </div>
  );
}
