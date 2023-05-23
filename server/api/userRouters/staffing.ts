import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

//get all shifts from the start of today onwards until a set amount of days after that

export const staffingRouter = createTRPCRouter({
  getStaffing: publicProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      days: z.number().optional(),
    }).optional())
    .query(({ ctx, input }) => {
      return ctx.prisma.staffing.findMany({
        where: {
          shift: {
            start: {
              gte: input?.fromDate || new Date(new Date().setHours(0, 0, 0, 0)),
            },
            end: {
              lte: new Date(new Date().setDate(new Date().getDate() + (input?.days || 7))),
            }
          }
        },
        include: {
          shift: {
            include: {
              staffings: {
                include: {
                  user: {
                    select: {
                      id: true,
                      first_name: true,
                    }
                  },
                  shift_type: true,
                }
              }
            }
          },
          shift_type: true,
        },
      })
    }
    ),
  getPersonalStaffing: protectedProcedure
    .input(z.object({
      fromDate: z.date().optional(),
      limit: z.number().min(1).max(20).nullish(),
      cursor: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 10;
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
                      first_name: true,
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
      });
      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor
      }
    }),
  removeAllStaffing: publicProcedure
    .mutation(async ({ ctx }) => {
      return ctx.prisma.staffing.deleteMany()
    })
});