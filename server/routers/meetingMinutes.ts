import { z } from "zod";
import { normalizeYouTubeUrl } from "../../shared/youtube";
import { deleteMeetingMinutes, listAdminMeetingMinutes, listPublishedMeetingMinutes, saveMeetingMinutes, setMeetingMinutesStatus } from "../meetingMinutesDb";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const optionalUrl = z.string().trim().url().max(1024).optional().nullable().or(z.literal(""));
const minutesInput = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  title: z.string().trim().min(3).max(255),
  meetingDate: z.number().int().positive(),
  hostTemple: z.string().trim().min(2).max(255),
  locationLabel: z.string().trim().min(2).max(255),
  city: z.string().trim().max(160).optional().nullable(),
  stateRegion: z.string().trim().max(160).optional().nullable(),
  summary: z.string().trim().min(20).max(2000),
  minutesBody: z.string().trim().min(20).max(100000),
  status: z.enum(["draft", "published"]),
  traditions: z.array(z.enum(["Theravada", "Mahayana", "Vajrayana"])).min(1).max(3),
  youtubeUrl: z.string().trim().max(512).optional().nullable(),
  youtubeTitle: z.string().trim().max(255).optional().nullable(),
  photoMediaId: z.number().int().positive().optional().nullable(),
  legacyUrl: optionalUrl,
}).superRefine((input, ctx) => {
  if (input.youtubeUrl && !normalizeYouTubeUrl(input.youtubeUrl)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeUrl"], message: "Enter a valid HTTPS YouTube watch, short, Shorts, or embed URL." });
  }
  if (input.youtubeUrl && !input.youtubeTitle?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeTitle"], message: "An accessible video title is required when a recording is provided." });
  }
  if (input.legacyUrl && new URL(input.legacyUrl).protocol !== "https:") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["legacyUrl"], message: "Use a secure https:// legacy URL." });
  }
});

export const meetingMinutesRouter = router({
  listPublished: publicProcedure.query(() => listPublishedMeetingMinutes()),
  listRecent: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(6).default(3) }).optional()).query(({ input }) => listPublishedMeetingMinutes(input?.limit ?? 3)),
  adminList: adminProcedure.query(() => listAdminMeetingMinutes()),
  save: adminProcedure.input(minutesInput).mutation(async ({ ctx, input }) => {
    const id = await saveMeetingMinutes(input.id, {
      slug: input.slug,
      title: input.title,
      meetingDate: input.meetingDate,
      hostTemple: input.hostTemple,
      locationLabel: input.locationLabel,
      city: input.city || null,
      stateRegion: input.stateRegion || null,
      summary: input.summary,
      minutesBody: input.minutesBody,
      status: input.status,
      youtubeUrl: input.youtubeUrl || null,
      youtubeTitle: input.youtubeTitle || null,
      photoMediaId: input.photoMediaId ?? null,
      legacyUrl: input.legacyUrl || null,
      publishedAt: input.status === "published" ? Date.now() : null,
      createdBy: ctx.user.id,
    }, input.traditions);
    return { id };
  }),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => {
    await setMeetingMinutesStatus(input.id, input.status);
    return { success: true } as const;
  }),
  remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await deleteMeetingMinutes(input.id);
    return { success: true } as const;
  }),
});
