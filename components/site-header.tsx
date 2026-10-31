import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <MainNav />
        <div className="header-controls">
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
