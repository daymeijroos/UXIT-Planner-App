import { createTRPCRouter } from "./trpc";
import { scheduleRouter } from "./schedule/schedule";
import { staffingRouter } from "./userRouters/staffing";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  staffing: staffingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
