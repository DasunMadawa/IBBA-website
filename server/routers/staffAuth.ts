import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { adminLoginKey, assertAdminLoginAllowed, clearAdminLoginFailures, recordAdminLoginFailure } from "../adminLoginRateLimit";
import { authenticateStaff, clearStaffSessionCookie, setStaffSessionCookie, updateStaffAccount } from "../staffAuth";

const email = z.string().trim().email().max(320).transform(value => value.toLowerCase());

export const staffAuthRouter = router({
  login: publicProcedure.input(z.object({ email, password: z.string().min(10).max(200) })).mutation(async ({ ctx, input }) => {
    const key = adminLoginKey(ctx.req.ip, input.email);
    try {
      assertAdminLoginAllowed(key);
    } catch (error) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: error instanceof Error ? error.message : "Too many sign-in attempts." });
    }
    const session = await authenticateStaff(input.email, input.password);
    if (!session) {
      recordAdminLoginFailure(key);
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Email or password is incorrect." });
    }
    clearAdminLoginFailures(key);
    setStaffSessionCookie(ctx.res, ctx.req, session.token);
    return { user: session.user };
  }),
  updateAccount: adminProcedure.input(z.object({
    currentPassword: z.string().min(10).max(200),
    email,
    displayName: z.string().trim().min(2).max(160),
    newPassword: z.string().min(14).max(200).optional().or(z.literal("")),
  })).mutation(async ({ ctx, input }) => {
    const updated = await updateStaffAccount(ctx.user.id, { ...input, newPassword: input.newPassword || undefined });
    if (!updated) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
    clearStaffSessionCookie(ctx.res, ctx.req);
    return { success: true } as const;
  }),
});
