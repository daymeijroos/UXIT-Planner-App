import { createTRPCRouter } from "./trpc"
import { scheduleRouter } from "./schedule/"
import { staffingRouter } from "./staffing"
import { staffRequiredRouter } from "./staff-required"
import { availabilityRouter } from "./availability"
import { absenceRouter } from "./absence/absence"
import { notificationRouter } from "./notification"
import { userRouter } from "./user"


export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  staffing: staffingRouter,
  staffRequired: staffRequiredRouter,
  availability: availabilityRouter,
  absence: absenceRouter,
  notification: notificationRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
