import { z } from "zod";
import { normalizeYouTubeUrl } from "../../shared/youtube";
import { deleteContentEntry, getPublishedEntryBySlug, listAdminEntries, listPublishedEntries, saveContentEntry, setContentEntryStatus } from "../contentDb";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const optionalText = z.string().trim().max(1024).optional().nullable();
const contentInput = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  title: z.string().trim().min(3).max(255),
  excerpt: z.string().trim().min(10).max(1000),
  body: z.string().trim().min(20).max(100000),
  contentType: z.enum(["news", "media"]),
  status: z.enum(["draft", "published"]),
  authorName: z.string().trim().min(2).max(160),
  publishedAt: z.number().int().positive().optional().nullable(),
  youtubeUrl: optionalText,
  youtubeTitle: z.string().trim().max(255).optional().nullable(),
  featuredMediaId: z.number().int().positive().optional().nullable(),
  legacyUrl: z.string().trim().url().max(1024).optional().nullable().or(z.literal("")),
  categoryNames: z.array(z.string().trim().min(1).max(100)).max(8),
  attachmentMediaIds: z.array(z.number().int().positive()).max(20).default([]),
  traditions: z.array(z.enum(["Theravada", "Mahayana", "Vajrayana"])).max(3).default([]),
}).superRefine((input, ctx) => {
  if (input.youtubeUrl && !normalizeYouTubeUrl(input.youtubeUrl)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeUrl"], message: "Enter a valid HTTPS YouTube watch, short, shorts, or embed URL." });
  }
  if (input.youtubeUrl && !input.youtubeTitle?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeTitle"], message: "An accessible video title is required when a YouTube URL is provided." });
  }
});

export const contentRouter = router({
  listPublished: publicProcedure.query(() => listPublishedEntries()),
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(({ input }) => getPublishedEntryBySlug(input.slug)),
  adminList: adminProcedure.query(() => listAdminEntries()),
  save: adminProcedure.input(contentInput).mutation(async ({ ctx, input }) => {
    const publishedAt = input.status === "published" ? input.publishedAt ?? Date.now() : input.publishedAt ?? null;
    const id = await saveContentEntry({
      id: input.id,
      categoryNames: input.categoryNames,
      attachmentMediaIds: input.attachmentMediaIds,
      traditions: input.traditions,
      values: {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        body: input.body,
        contentType: input.contentType,
        status: input.status,
        authorName: input.authorName,
        publishedAt,
        youtubeUrl: input.youtubeUrl || null,
        youtubeTitle: input.youtubeTitle || null,
        featuredMediaId: input.featuredMediaId ?? null,
        legacyUrl: input.legacyUrl || null,
        createdBy: ctx.user.id,
      },
    });
    return { id };
  }),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => {
    await setContentEntryStatus(input.id, input.status);
    return { success: true } as const;
  }),
  remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await deleteContentEntry(input.id);
    return { success: true } as const;
  }),
});
