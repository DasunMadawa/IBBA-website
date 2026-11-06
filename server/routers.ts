import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { contentRouter } from "./routers/content";
import { contactRouter } from "./routers/contact";
import { eventsRouter } from "./routers/events";
import { mediaRouter } from "./routers/media";
import { meetingMinutesRouter } from "./routers/meetingMinutes";
import { staffAuthRouter } from "./routers/staffAuth";
import { studyCirclesRouter } from "./routers/studyCircles";
import { templesRouter } from "./routers/temples";
import { clearStaffSessionCookie, revokeStaffSession } from "./staffAuth";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      await revokeStaffSession(ctx.req);
      clearStaffSessionCookie(ctx.res, ctx.req);
      return {
        success: true,
      } as const;
    }),
  }),
  content: contentRouter,
  contact: contactRouter,
  events: eventsRouter,
  media: mediaRouter,
  meetingMinutes: meetingMinutesRouter,
  staffAuth: staffAuthRouter,
  studyCircles: studyCirclesRouter,
  temples: templesRouter,
});

export type AppRouter = typeof appRouter;
