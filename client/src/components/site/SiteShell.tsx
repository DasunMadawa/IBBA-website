import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const defaultDescription = "The International Buddhist Association of America supports collaboration among Buddhist communities across the United States.";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": { title: "IBAA — International Buddhist Association of America", description: "Uniting America’s Buddhist traditions through study, service, public representation, and inter-community cooperation." },
  "/about": { title: "About IBAA", description: "Learn about IBAA’s history, mission, values, and national non-sectarian purpose." },
  "/buddhist-traditions": { title: "Buddhist Traditions", description: "Explore a carefully sourced, non-sectarian introduction to the worldwide diversity of Buddhist traditions and communities." },
  "/about/governance": { title: "Governance", description: "IBAA leadership, governance context, and legacy organizational records." },
  "/about/directors": { title: "Board of Directors", description: "Monastic and lay leaders serving IBAA’s national, multi-tradition mission." },
  "/about/governance/officers": { title: "Leadership", description: "IBAA leadership, governance context, and legacy organizational records." },
  "/about/governance/advisory-council": { title: "Leadership", description: "IBAA leadership, governance context, and legacy organizational records." },
  "/about/governance/dc-liaison": { title: "Leadership", description: "IBAA leadership, governance context, and legacy organizational records." },
  "/annual-delegates": { title: "Annual Delegates", description: "IBAA’s annual delegates and inter-community consultation program." },
  "/programs": { title: "Programs", description: "IBAA programs for learning, youth, national representation, and Buddhist community cooperation." },
  "/study-circles": { title: "Dharma Study Circles", description: "IBAA Dharma Study Circles and their preserved meeting records." },
  "/temple-outreach": { title: "Temple Outreach", description: "IBAA temple relationships across traditions and the BuddhaMap Android app for finding a nearby Buddhist temple." },
  "/events": { title: "Events", description: "Archived and future IBAA events presented in an accessible agenda calendar." },
  "/member-temples": { title: "Member Temples and Organizations", description: "IBAA member temples and organizations with their supplied addresses, website links, and separate individual members." },
  "/communities": { title: "Member Temples and Organizations", description: "IBAA member temples and organizations with their supplied addresses and websites." },
  "/news-media": { title: "News & Media", description: "Current IBAA publishing and the complete public legacy article archive from IBAA.org." },
  "/resources": { title: "Resources", description: "IBAA documents, forms, archive materials, and Buddhist educational resources." },
  "/join": { title: "Join IBAA", description: "Membership information and participation resources for Buddhist organizations and communities." },
  "/donate": { title: "Support IBAA", description: "Support IBAA’s non-sectarian educational, service, and community programs." },
  "/contact": { title: "Contact IBAA", description: "Contact the International Buddhist Association of America." },
};

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    const basePath = location.split("?")[0] || "/";
    const metadata = pageMetadata[basePath] ?? (basePath.startsWith("/news/")
      ? { title: "IBAA Publication", description: "A current or preserved legacy publication from the International Buddhist Association of America." }
      : basePath.startsWith("/study-circles/minutes/")
        ? { title: "Dharma Meeting Minutes", description: "A written IBAA Study Circle record, with optional group photography and recording." }
        : basePath.startsWith("/media/")
          ? { title: "IBAA Legacy Media", description: "A preserved attachment record from the former IBAA.org media library." }
          : { title: "IBAA", description: defaultDescription });
    const title = metadata.title.includes("IBAA") ? metadata.title : `${metadata.title} — IBAA`;
    const canonicalUrl = `https://www.ibaa.org${basePath === "/" ? "/" : basePath}`;
    document.title = title;
    setMeta("description", metadata.description);
    setMeta("og:title", title, true);
    setMeta("og:description", metadata.description, true);
    setMeta("og:type", basePath.startsWith("/news/") ? "article" : "website", true);
    setMeta("og:url", canonicalUrl, true);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location]);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </div>
  );
}
