import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { notificationService } from "../../notificationService"
import { env } from "../../../env/server.mjs"
import { Backup } from "@prisma/client"

export const absenceRouter = createTRPCRouter({
  checkOut: protectedProcedure
    .input(
      z.object({
        shift_id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const shift = await ctx.prisma.shift.findUnique({
        where: { id: input.shift_id },
      })
      if (!shift) throw new Error("Shift not found")

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          preference: true,
        },
      })
      if (!user) throw new Error("User not found")

      if (!user.preference) throw new Error("Preference not found")

      // Create absence
      const createdAbsence = await ctx.prisma.absence.create({
        data: {
          start: shift.start,
          end: shift.end,
          reason: input.reason,
          preference: {
            connect: {
              id: user.preference.id,
            },
          },
        },
      })

      // Remove staffing
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not found")
      }

      const staffing = await ctx.prisma.staffing.findFirst({
        where: {
          shift_id: input.shift_id,
          user_id: userId,
        },
      })

      if (!staffing) {
        throw new Error("Staffing not found")
      }

      await ctx.prisma.staffing.delete({
        where: {
          id: staffing.id,
        },
      })

      const openStaffing = await ctx.prisma.openStaffing.create({
        data: {
          shift: {
            connect: {
              id: shift.id,
            },
          },
          shift_type: {
            connect: {
              id: staffing.shift_type_id,
            },
          },
        }
      })

      const backups = await ctx.prisma.backup.findMany({
        where: {
          date: {
            gte: new Date(shift.start.getFullYear(), shift.start.getMonth(), shift.start.getDate()),
            lte: new Date(shift.end.getFullYear(), shift.end.getMonth(), shift.end.getDate() + 1),
          },
        },
      })
      const backupUserIds = backups.map((backup: Backup) => backup.user_id)
      let sendAllUserDelayTime = 0
      if (backupUserIds.length > 0) {
        notificationService.sendNotificationToUser({ user_ids: backupUserIds, message: `${user.name} has checked out of ${shift.start.toLocaleString()} - ${shift.end.toLocaleString()}`, callbackURL: `${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_APP_PORT}/open-shift/${openStaffing.id}` })
        sendAllUserDelayTime = 1000 * 60 * 60 * 2 // 2 hours
      }

      setTimeout(async () => {
        const stillOpen = await ctx.prisma.openStaffing.findUnique({
          where: {
            id: openStaffing.id,
          },
        })
        if (!stillOpen) return
        const allUsers = await ctx.prisma.user.findMany()
        const allUserIds = allUsers.map((user) => user.id)
        notificationService.sendNotificationToUser({ user_ids: allUserIds, message: `${user.name} has checked out of ${shift.start.toLocaleString()} - ${shift.end.toLocaleString()}`, callbackURL: `${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_APP_PORT}/open-shift/${openStaffing.id}` })
      }, sendAllUserDelayTime)

      return createdAbsence
    }),
})
