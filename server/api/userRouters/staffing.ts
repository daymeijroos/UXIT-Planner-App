import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

//get all shifts from the start of today onwards until a set amount of days after that

export const staffingRouter = createTRPCRouter({
  getStaffing: protectedProcedure
    .input(z.object({
      days: z.number().optional(),
    }).optional())
    .query(({ctx, input}) => {
      return ctx.prisma.staffing.findMany({
        where: {
          user_id: ctx.session.user.id,
          shift: {
            start: {
              gte: new Date(new Date().setDate(new Date().getDate())),
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
  });