import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

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
  removeShiftAdmin: protectedProcedure
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
});
