import type { Express, Request } from "express";
import { legacyRedirects } from "./legacyRedirects.generated";
import { relocatedAboutPath } from "../shared/aboutRoutes";
import { correctedFormDownloads } from "../shared/currentIbaaForms";

function lookupLegacyPath(req: Request) {
  const candidates = new Set([req.path]);
  if (req.path !== "/") {
    candidates.add(req.path.endsWith("/") ? req.path.slice(0, -1) : `${req.path}/`);
  }
  for (const candidate of Array.from(candidates)) {
    const match = legacyRedirects.get(candidate);
    if (match) return match;
  }
  return null;
}

export function registerLegacyRedirects(app: Express) {
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const correctedForm = correctedFormDownloads.get(req.path);
    if (correctedForm) {
      const queryIndex = req.originalUrl.indexOf("?");
      res.redirect(301, `${correctedForm}${queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : ""}`);
      return;
    }
    const aboutDestination = relocatedAboutPath(req.path);
    if (aboutDestination !== req.path) {
      const queryIndex = req.originalUrl.indexOf("?");
      res.redirect(301, `${aboutDestination}${queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : ""}`);
      return;
    }
    const formerMinutes = /^\/meeting-minutes(?:\/([^/]+))?\/?$/.exec(req.path);
    if (formerMinutes) {
      res.redirect(301, formerMinutes[1] ? `/study-circles/minutes/${formerMinutes[1]}` : "/temple-outreach");
      return;
    }
    const match = lookupLegacyPath(req);
    if (!match || match.destination === req.originalUrl) return next();
    res.redirect(301, relocatedAboutPath(match.destination));
  });
}
