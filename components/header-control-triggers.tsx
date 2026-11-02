import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Menu, Moon, Sun } from "lucide-react";

// Keep the initial header independent of the menu/dialog libraries.
export const ThemeTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function ThemeTrigger(props, ref) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      {...props}
      ref={ref}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" aria-hidden="true" />
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
});

export const MobileNavTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function MobileNavTrigger(props, ref) {
  return (
    <button
      type="button"
      className="mobile-menu-button"
      aria-label="Open navigation"
      {...props}
      ref={ref}
    >
      <Menu size={21} aria-hidden="true" />
    </button>
  );
});
