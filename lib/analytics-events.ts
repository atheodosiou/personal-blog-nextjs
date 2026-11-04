type PortfolioEvent = {
  name: "contact_click" | "project_click";
  parameters: Record<string, string>;
};

const projectDestinations: Record<string, [string, string]> = {
  "study-workplace.theodosiou.me/": ["study-workspace", "demo"],
  "github.com/atheodosiou/study-workplace": ["study-workspace", "source"],
  "github.com/atheodosiou/study-workspace-api": [
    "study-workspace",
    "api_source",
  ],
  "atheodosiou.github.io/xlf-sync": ["xlf-sync", "docs"],
  "github.com/atheodosiou/xlf-sync": ["xlf-sync", "source"],
  "npmjs.com/package/xlf-sync": ["xlf-sync", "package"],
  "availo.gr/": ["availo", "demo"],
  "capmentor.com/": ["capmentor", "demo"],
  "github.com/atheodosiou/capmentor.com": ["capmentor", "source"],
  "seaskills.org/": ["seaskills", "demo"],
};

// Classify only authored destinations. Never send email addresses, phone numbers,
// arbitrary link text, query strings, fragments, or visitor-entered values.
export function getPortfolioEvent(
  href: string,
  origin: string,
  contact: { email: string; whatsapp: string },
): PortfolioEvent | null {
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (
    url.protocol === "mailto:" &&
    url.pathname.toLowerCase() === contact.email.toLowerCase()
  ) {
    return { name: "contact_click", parameters: { contact_method: "email" } };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const whatsapp = new URL(contact.whatsapp);
  if (url.origin === whatsapp.origin && url.pathname === whatsapp.pathname) {
    return {
      name: "contact_click",
      parameters: { contact_method: "whatsapp" },
    };
  }
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (url.origin === new URL(origin).origin) {
    const project = path.match(/^\/projects\/(study-workspace|xlf-sync)$/)?.[1];
    return project
      ? {
          name: "project_click",
          parameters: { project_id: project, destination: "case_study" },
        }
      : null;
  }
  const match =
    projectDestinations[`${url.hostname.replace(/^www\./, "")}${path}`];
  return match
    ? {
        name: "project_click",
        parameters: { project_id: match[0], destination: match[1] },
      }
    : null;
}
