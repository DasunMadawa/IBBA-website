import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createContactInquiry, listContactInquiries, setContactInquiryStatus } from "../contactDb";
import { consumeContactSubmission } from "../contactRateLimit";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const inquiryInput = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  organization: z.string().trim().max(255).optional().nullable(),
  topic: z.enum(["general", "programs", "community", "archive", "partnership"]),
  message: z.string().trim().min(20).max(5000),
  website: z.string().max(0, "Submission could not be accepted."),
});

function requestKey(req: { ip?: string; headers: Record<string, unknown> }) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip;
  return String(value || "anonymous").trim();
}

export const contactRouter = router({
  submit: publicProcedure.input(inquiryInput).mutation(async ({ ctx, input }) => {
    const limit = consumeContactSubmission(requestKey(ctx.req));
    if (!limit.allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before sending another inquiry." });
    const id = await createContactInquiry({
      name: input.name,
      email: input.email.toLowerCase(),
      organization: input.organization || null,
      topic: input.topic,
      message: input.message,
      status: "new",
    });
    return { success: true as const, reference: id ? `IBAA-${id}` : "IBAA-received" };
  }),
  adminList: adminProcedure.query(() => listContactInquiries()),
  setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "read", "archived"]) })).mutation(async ({ input }) => {
    await setContactInquiryStatus(input.id, input.status);
    return { success: true } as const;
  }),
});
