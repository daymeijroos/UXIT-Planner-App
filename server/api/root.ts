import { createTRPCRouter } from "./trpc"
import { scheduleRouter } from "./schedule/"
import { staffingRouter } from "./staffing"
import { requiredStaffingRouter } from "./required-staffing"
import { availabilityRouter } from "./availability"


export const appRouter = createTRPCRouter({
  schedule: scheduleRouter,
  staffing: staffingRouter,
  requiredStaffing: requiredStaffingRouter,
  availability: availabilityRouter,
})

export type AppRouter = typeof appRouter
