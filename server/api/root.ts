import { createTRPCRouter } from "./trpc"
import { scheduleRouter } from "./schedule/"
import { staffingRouter } from "./staffing"
import { staffRequiredRouter } from "./staff-required"
import { availabilityRouter } from "./availability"
import { absenceRouter } from "./absence/absence"
import { notificationRouter } from "./notification"
import { userRouter } from "./user"
import { shiftRouter } from "./shift"


export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  staffing: staffingRouter,
  user: userRouter,
  staffRequired: staffRequiredRouter,
  availability: availabilityRouter,
  absence: absenceRouter,
  shift: shiftRouter,
  notification: notificationRouter,
})

export type AppRouter = typeof appRouter
