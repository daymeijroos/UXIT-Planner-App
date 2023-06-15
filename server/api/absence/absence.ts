// absence export

import { z } from "zod"
import { publicProcedure, createTRPCRouter, protectedProcedure, restrictedProcedure } from "../trpc";
import { Role } from "../../../prisma/role";

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

      return createdAbsence;
    }),

  createAbsence: restrictedProcedure(Role.ADMIN)
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        reason: z.string().optional(),
        userId: z.string(),
      })
    )

    .mutation(async ({ ctx, input }) => {

      if (input.startDate > input.endDate) throw new Error("Start date cannot be after end date")

      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId }
      })

      const conflictingStaffings = await ctx.prisma.staffing.findMany({
        where: {user_id: input.userId, shift: {start: {lte: input.endDate}, end: {gte: input.startDate}}}
      })

      if (conflictingStaffings.length > 0) throw new Error("User is already staffed during this period")


      const createAbsencePeriod = await ctx.prisma.absence.create({
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          reason: input.reason,
          userId: input.userId
        }
      })

    }),


})
