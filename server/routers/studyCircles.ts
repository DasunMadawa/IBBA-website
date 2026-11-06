import { z } from "zod";
import { normalizeYouTubeUrl } from "../../shared/youtube";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { deleteStudyCircle, listAdminStudyCircles, listPublishedStudyCircles, saveStudyCircle, setStudyCircleStatus } from "../studyCirclesDb";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid time.");
const optionalHttpsUrl = z.string().trim().url().max(1024).refine(value => value.startsWith("https://"), "Use a secure https:// link.").optional().nullable().or(z.literal(""));
const input = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  region: z.enum(["Washington DC Metro Area", "Greater Los Angeles Metro Area", "San Francisco Bay Area"]),
  meetingMonth: z.number().int().min(1).max(12),
  meetingYear: z.number().int().min(2024).max(2100),
  meetingDate: z.number().int().positive(),
  startTime: time.optional().nullable().or(z.literal("")),
  endTime: time.optional().nullable().or(z.literal("")),
  timeZone: z.string().trim().min(2).max(100).default("America/Los_Angeles"),
  templeName: z.string().trim().min(2).max(255),
  nationality: z.string().trim().min(2).max(160),
  yana: z.enum(["Theravada", "Mahayana", "Vajrayana"]),
  venueNote: z.string().trim().max(512).optional().nullable(),
  description: z.string().trim().min(10).max(5000),
  imageMediaId: z.number().int().positive().optional().nullable(),
  youtubeUrl: optionalHttpsUrl,
  youtubeTitle: z.string().trim().max(255).optional().nullable(),
  status: z.enum(["draft", "published"]),
}).superRefine((value, ctx) => {
  if (Boolean(value.startTime) !== Boolean(value.endTime)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "Enter both start and end times, or leave both blank." });
  if (value.startTime && value.endTime && value.endTime <= value.startTime) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "End time must be after start time." });
  if (value.youtubeUrl && !normalizeYouTubeUrl(value.youtubeUrl)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeUrl"], message: "Use a valid YouTube URL." });
  if (value.youtubeUrl && !value.youtubeTitle?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeTitle"], message: "Add an accessible title for the YouTube video." });
  const date = new Date(value.meetingDate);
  if (date.getUTCMonth() + 1 !== value.meetingMonth || date.getUTCFullYear() !== value.meetingYear) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meetingDate"], message: "Month and year must match the exact date." });
});

export const studyCirclesRouter = router({
  listPublished: publicProcedure.query(() => listPublishedStudyCircles()),
  adminList: adminProcedure.query(() => listAdminStudyCircles()),
  save: adminProcedure.input(input).mutation(async ({ ctx, input }) => {
    const { id, ...values } = input;
    const entryId = await saveStudyCircle({
      id,
      values: {
        ...values,
        startTime: values.startTime || null,
        endTime: values.endTime || null,
        venueNote: values.venueNote || null,
        imageMediaId: values.imageMediaId ?? null,
        youtubeUrl: values.youtubeUrl || null,
        youtubeTitle: values.youtubeTitle || null,
        publishedAt: values.status === "published" ? Date.now() : null,
        createdBy: ctx.user.id,
      },
    });
    return { id: entryId };
  }),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => { await setStudyCircleStatus(input.id, input.status); return { success: true } as const; }),
  remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteStudyCircle(input.id); return { success: true } as const; }),
});
