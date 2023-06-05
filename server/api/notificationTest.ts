import { createTRPCRouter, restrictedProcedure } from "./trpc"
import { Role } from "../../prisma/role"
import { OneSignal, notificationService } from "../notificationService"
import { env } from "../../env/server.mjs"

export const notificationRouter = createTRPCRouter({
  send: restrictedProcedure(Role.ADMIN)
    .mutation(() => {
      notificationService.sendNotification({
        user_ids: ["clihxwr5i0006u1eoen3iy7s8"],
        message: "This is a test notification"
      })
    }),
})