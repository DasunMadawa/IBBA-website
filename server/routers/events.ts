import { z } from "zod";
import { normalizeYouTubeUrl } from "../../shared/youtube";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { deleteEvent, getPublishedEventBySlug, listAdminEvents, listPublishedEvents, saveEvent, setEventStatus } from "../eventsDb";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid time.");
const optionalHttpsUrl = z.string().trim().url().max(1024).refine(value => value.startsWith("https://"), "Use a secure https:// link.").optional().nullable().or(z.literal(""));
const input = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(255),
  eventDate: z.number().int().positive(),
  startTime: time.optional().nullable().or(z.literal("")),
  endTime: time.optional().nullable().or(z.literal("")),
  timeZone: z.string().trim().min(2).max(100).default("America/Los_Angeles"),
  region: z.enum(["Los Angeles", "San Francisco Bay Area", "Washington DC", "Other"]),
  city: z.string().trim().max(160).optional().nullable(),
  venueName: z.string().trim().min(2).max(255),
  address: z.string().trim().max(512).optional().nullable(),
  description: z.string().trim().min(20).max(5000),
  status: z.enum(["draft", "published"]),
  traditions: z.array(z.enum(["Theravada", "Mahayana", "Vajrayana"])).max(3),
  zoomUrl: optionalHttpsUrl,
  youtubeUrl: optionalHttpsUrl,
  youtubeTitle: z.string().trim().max(255).optional().nullable(),
  imageMediaId: z.number().int().positive().optional().nullable(),
}).superRefine((value, ctx) => {
  if (Boolean(value.startTime) !== Boolean(value.endTime)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "Enter both start and end times, or leave both blank when the time is not confirmed." });
  if (value.startTime && value.endTime && value.endTime <= value.startTime) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "End time must be after start time." });
  if (value.youtubeUrl && !normalizeYouTubeUrl(value.youtubeUrl)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeUrl"], message: "Use a valid YouTube URL." });
  if (value.youtubeUrl && !value.youtubeTitle?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["youtubeTitle"], message: "Add an accessible title for the YouTube video." });
});

export const eventsRouter = router({
  listPublished: publicProcedure.query(() => listPublishedEvents()),
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(({ input }) => getPublishedEventBySlug(input.slug)),
  adminList: adminProcedure.query(() => listAdminEvents()),
  save: adminProcedure.input(input).mutation(async ({ ctx, input }) => {
    const { id, traditions, ...values } = input;
    const eventId = await saveEvent({ id, traditions, values: { ...values, startTime: values.startTime || null, endTime: values.endTime || null, city: values.city || null, address: values.address || null, zoomUrl: values.zoomUrl || null, youtubeUrl: values.youtubeUrl || null, youtubeTitle: values.youtubeTitle || null, imageMediaId: values.imageMediaId ?? null, publishedAt: values.status === "published" ? Date.now() : null, createdBy: ctx.user.id } });
    return { id: eventId };
  }),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => { await setEventStatus(input.id, input.status); return { success: true } as const; }),
  remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteEvent(input.id); return { success: true } as const; }),
});
