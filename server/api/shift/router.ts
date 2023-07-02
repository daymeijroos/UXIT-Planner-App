import {createTRPCRouter, protectedProcedure, restrictedProcedure} from "../trpc";
import { z } from "zod";
import {Role} from "../../../prisma/role";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;

export const shiftRouter = createTRPCRouter({
  getAllShifts: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.shift.findMany({
        where: {
          start: {
            gte: new Date()
          },
        },
        include: {
          staffings: {
            include: {
              user: true,
              shift_type: true
            }
          },
          staff_required: {
            include: {
              shift_type: true
            }
          }
        }
      });
    }),
  removeShiftAdmin: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      shift_id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.shift.delete({
        where: {
          id: input.shift_id
        }
      });
    }),
  updateShiftStartAndEndTimes: restrictedProcedure(Role.ADMIN)
      .input(
          z.object({
            id: z.string(),
            startTime: z.date(),
            endTime: z.date(),
          }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.shift.update({
          where: {
            id: input.id
          },
          data: {
            start: input.startTime,
            end: input.endTime
          }
        })
      }),
    updateAvailability: restrictedProcedure(Role.ADMIN)
        .input(
            z.object({
                weekday: z.number(),
                updatedUser: z.object({
                    preference: z.object({
                        availability_even_week_id: z.string(),
                    }),
                }),
            })
        ).mutation(async ({ctx, input}) => {
            const { weekday, updatedUser } = input;

            return ctx.prisma.availabilityEvenWeek.update({
                    data: {
                        weekday: weekday,
                        availability_even_week: {
                            connect: {
                                id: updatedUser.preference.availability_even_week_id
                            }
                        }
                    }
                })
            })
})
