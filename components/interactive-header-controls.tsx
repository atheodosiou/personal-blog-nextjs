import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import type { HeaderControlsProps } from "./header-controls";

export function InteractiveHeaderControls({ initialControl, focusThemeItem }: HeaderControlsProps) {
  return (
    <>
      <ModeToggle defaultOpen={initialControl === "theme"} focusFirstItem={focusThemeItem} />
      <MobileNav defaultOpen={initialControl === "navigation"} />
    </>
  );
}
