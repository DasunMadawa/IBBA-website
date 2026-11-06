// Canonical destinations for the About governance relocation.
export const aboutRelocations: Readonly<Record<string, string>> = {
  "/governance": "/about/governance",
  "/directors": "/about/directors",
  "/board-of-directors": "/about/directors",
  "/leadership": "/about/directors",
  "/leadership/board-of-directors": "/about/directors",
  "/leadership/officers": "/about/governance/officers",
  "/leadership/advisory-council": "/about/governance/advisory-council",
  "/leadership/dc-liaison": "/about/governance/dc-liaison",
};

export function relocatedAboutPath(path: string) {
  const normalized = path.length > 1 ? path.replace(/\/$/, "") : path;
  return aboutRelocations[normalized] ?? path;
}
