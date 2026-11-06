export const currentIbaaForms = {
  membership: "/manus-storage/ibaa-membership-application-clinton-2026-10-27_ef4821d1.pdf",
  donation: "/manus-storage/ibaa-donation-form-clinton-2026-10-27_925c5c01.pdf",
} as const;

export const correctedFormDownloads = new Map<string, string>([
  ["/manus-storage/ibaa-application-form_0bbb5887.pdf", currentIbaaForms.membership],
  ["/manus-storage/ibaa-donation-form_c3028c7b.pdf", currentIbaaForms.donation],
]);
