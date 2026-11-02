"use client";

import { useTheme } from "next-themes";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeTrigger } from "./header-control-triggers";

export function ModeToggle({ defaultOpen = false, focusFirstItem = false }: {
  defaultOpen?: boolean;
  focusFirstItem?: boolean;
}) {
  const { setTheme } = useTheme();
  const firstOpen = useRef(true);

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <ThemeTrigger />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onFocus={(event) => {
          // The first key event precedes the lazy-loaded menu's keyboard listener.
          if (!firstOpen.current) return;
          firstOpen.current = false;
          if (focusFirstItem && event.target === event.currentTarget) {
            event.currentTarget.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
          }
        }}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
