import { createTRPCRouter, protectedProcedure, restrictedProcedure } from "../trpc"
import { Role } from "../../../prisma/role"
import { notificationService } from "../../notificationService"
import { z } from "zod"

export const notificationRouter = createTRPCRouter({
  send: restrictedProcedure(Role.ADMIN)
    .mutation(() => {
      notificationService.sendNotificationToUser({
        user_ids: ["clihxwr5i0006u1eoen3iy7s8"],
        message: "This is a test notification",
        callbackURL: "https://google.com"
      })
    }),
  delete: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return notificationService.deleteNotificationForUser(input.id, ctx.session.user.id)
    }),
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return notificationService.getNotificationsOfUser(ctx.session.user.id)
    })
})