import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

//get all shifts from the start of today onwards until a set amount of days after that

export const staffingRouter = createTRPCRouter({
  getStaffing: publicProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      limit: z.number().min(1).max(20).nullish(),
      cursor: z.object({
        id: z.string(),
        shift: z.object({
          start: z.date(),
        }),
      }).nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10
      const items = await ctx.prisma.staffing.findMany({
        where: {
          shift: {
            start: {
              gte: new Date((input.cursor?.shift.start || input?.fromDate || new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 * (limit + 1)),
            },
          }
        },
        cursor: input?.cursor ? {
          id: input.cursor.id,
        } : undefined,
        include: {
          shift: {
            include: {
              staffings: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    }
                  },
                  shift_type: true,
                }
              }
            }
          },
          shift_type: true,
        },
        orderBy: {
          shift: {
            start: 'asc',
          }
        }
      })
      let nextCursor: { id: string, shift: { start: Date } } | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem
      }
      let previousCursor: { id: string, shift: { start: Date } } | undefined = undefined
      if (items.length > 0) {
        const previousItem = items.shift()
        previousCursor = previousItem
      }
      return {
        items,
        nextCursor,
        previousCursor
      }
    }),
  getPersonalStaffing: protectedProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      limit: z.number().min(1).max(20).nullish(),
      cursor: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10
      const items = await ctx.prisma.staffing.findMany({
        take: limit + 1,
        where: {
          user_id: ctx.session.user.id,
          shift: {
            start: {
              gte: input?.fromDate || new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
        cursor: input?.cursor ? {
          id: input.cursor,
        } : undefined,
        include: {
          shift: {
            include: {
              staffings: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    }
                  },
                  shift_type: true,
                }
              }
            }
          },
          shift_type: true,
        },
        orderBy: {
          shift: {
            start: 'asc',
          }
        }
      })
      let nextCursor: string | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }
      return {
        items,
        nextCursor
      }
    }),
  removeAllStaffing: publicProcedure
    .mutation(async ({ ctx }) => {
      return ctx.prisma.staffing.deleteMany()
    }),
  createStaffing: publicProcedure
    .input(
      z.object({
        shift_id: z.string(),
        user_id: z.string(),
        shift_type_id: z.string(),
      }))
    .query(async ({ ctx, input }) => {
      const staffing = await ctx.prisma.staffing.create({
        data: {
          user_id: input.user_id,
          shift_id: input.shift_id,
          shift_type_id: input.shift_type_id,
        }
      })
      return staffing
    }),
  removeStaffing: publicProcedure
    .input(z.object({
      shift_id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        throw new Error("User not found")
      }

      const staffing = await ctx.prisma.staffing.findFirst({
        where: {
          shift_id: input.shift_id,
          user_id: userId
        }
      })

      if (!staffing) {
        throw new Error("Staffing not found")
      }

      return ctx.prisma.staffing.delete({
        where: {
          id: staffing.id
        }
      })
    }),
  changeShiftType: publicProcedure
    .input(
      z.object({
        staffing_id: z.string(),
        shift_type_id: z.string()
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.staffing.update({
        where: {
          id: input.staffing_id
        },
        data: {
          shift_type_id: input.shift_type_id
        }
      })
    }),
})
