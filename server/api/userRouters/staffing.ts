import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

//get all shifts from the start of today onwards until a set amount of days after that

export const staffingRouter = createTRPCRouter({
  getStaffing: publicProcedure
    .input(z.object({
      from: z.date().optional(),
      days: z.number().optional(),
    }).optional())
    .query(({ctx, input}) => {
      return ctx.prisma.staffing.findMany({
        where: {
          shift: {
            start: {
              gte: input?.from || new Date(new Date().setHours(0, 0, 0, 0)),
            },
            end: {
              lte: new Date(new Date().setDate(new Date(input?.from).getDate() + (input?.days || 7))),
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
  removeAllStaffing: publicProcedure
    .mutation(async ({ctx}) => {
      return ctx.prisma.staffing.deleteMany()
    })
});
