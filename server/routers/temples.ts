import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { deleteTempleDirectoryEntry, getAdminTemple, listAdminTemples, listPublishedTemples, saveTempleDirectoryEntry, setTempleDirectoryStatus } from "../templeDb";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const optionalUrl = z.string().trim().url().max(1024).optional().nullable().or(z.literal(""));
const templeInput = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  name: z.string().trim().min(2).max(255),
  status: z.enum(["draft", "published"]),
  verificationStatus: z.enum(["pending", "verified"]),
  tradition: z.string().trim().max(120),
  lineage: z.string().trim().max(255).optional().nullable(),
  description: z.string().trim().max(3000).refine(value => value.length === 0 || value.length >= 20, "Use at least 20 characters or leave blank."),
  addressLine1: z.string().trim().max(255).optional().nullable(),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  city: z.string().trim().max(160),
  stateRegion: z.string().trim().max(160),
  postalCode: z.string().trim().max(32).optional().nullable(),
  country: z.string().trim().min(2).max(120),
  websiteUrl: optionalUrl,
  publicEmail: z.string().trim().email().max(320).optional().nullable().or(z.literal("")),
  legacyUrl: optionalUrl,
}).superRefine((input, ctx) => {
  if (!input.city && !input.stateRegion) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "Enter the supplied city or state/region." });
  if (input.status === "published" && input.verificationStatus !== "verified") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "Only verified community records can be published." });
  }
  for (const field of ["websiteUrl", "legacyUrl"] as const) {
    if (!input[field]) continue;
    if (new URL(input[field]).protocol !== "https:") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: "Use a secure https:// URL." });
    }
  }
});

export const templesRouter = router({
  listPublished: publicProcedure.query(() => listPublishedTemples()),
  adminList: adminProcedure.query(() => listAdminTemples()),
  save: adminProcedure.input(templeInput).mutation(async ({ ctx, input }) => {
    const now = Date.now();
    const id = await saveTempleDirectoryEntry(input.id, {
      slug: input.slug,
      name: input.name,
      status: input.status,
      verificationStatus: input.verificationStatus,
      tradition: input.tradition,
      lineage: input.lineage || null,
      description: input.description,
      addressLine1: input.addressLine1 || null,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      stateRegion: input.stateRegion,
      postalCode: input.postalCode || null,
      country: input.country,
      websiteUrl: input.websiteUrl || null,
      publicEmail: input.publicEmail || null,
      legacyUrl: input.legacyUrl || null,
      verifiedAt: input.verificationStatus === "verified" ? now : null,
      verifiedBy: input.verificationStatus === "verified" ? ctx.user.id : null,
      publishedAt: input.status === "published" ? now : null,
      createdBy: ctx.user.id,
    });
    return { id };
  }),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => {
    if (input.status === "published") {
      const entry = await getAdminTemple(input.id);
      if (!entry || entry.verificationStatus !== "verified") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Verify this community record before publishing it." });
      }
    }
    await setTempleDirectoryStatus(input.id, input.status);
    return { success: true } as const;
  }),
  remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await deleteTempleDirectoryEntry(input.id);
    return { success: true } as const;
  }),
});
