export type MemberAddress = {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  postalCode?: string | null;
};

export function formatMemberAddress(entry: MemberAddress): string {
  const statePostal = [entry.stateRegion, entry.postalCode].filter(Boolean).join(" ");
  return [entry.addressLine1, entry.addressLine2, entry.city, statePostal].filter(Boolean).join(", ");
}
