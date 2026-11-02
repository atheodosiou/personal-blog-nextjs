import { MainNav } from "./main-nav";
import { HeaderControls } from "./header-controls";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <MainNav />
        <HeaderControls />
      </div>
    </header>
  );
}
