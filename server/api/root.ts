import { createTRPCRouter } from "./trpc"
import { scheduleRouter } from "./schedule/"
import { staffingRouter } from "./staffing"
import { staffRequiredRouter } from "./staff-required"
import { availabilityRouter } from "./availability"
import { userRouter } from "./userRouters"

export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  staffing: staffingRouter,
  user: userRouter,
  staffRequired: staffRequiredRouter,
  availability: availabilityRouter,
})

export type AppRouter = typeof appRouter
