import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { OpenStaffing, Shift } from "@prisma/client"

export const openStaffingRouter = createTRPCRouter({
  getOpenStaffing: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.openStaffing.findUnique({
        where: {
          id: input.id
        },
        include: {
          shift: true,
          absent_user: true,
        }
      })
    }),
  fillOpenStaffing: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const openStaffing: OpenStaffing = await ctx.prisma.openStaffing.delete({
        where: {
          id: input.id
        },
      })
      if (!openStaffing) {
        throw new Error("Open staffing not found")
      }
      return ctx.prisma.staffing.create({
        data: {
          shift: {
            connect: {
              id: openStaffing.shift_id,
            }
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          shift_type: {
            connect: {
              id: openStaffing.shift_type_id,
            },
          },
        },
      })
    }),
})
