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
              user: true
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
      await ctx.prisma.staffing.deleteMany({
        where: {
          shift: {
            id: input.shift_id,
          },
        },
      });

      await ctx.prisma.staff_required.deleteMany({
        where: {
          shift: {
            id: input.shift_id,
          },
        },
      });

      // await ctx.prisma.backup.deleteMany({
      //   where: {
      //     shift: {
      //       id: shift_id,
      //     },
      //   },
      // });

      return ctx.prisma.shift.delete({
        where: {
          id: input.shift_id
        }
      });
    }),
});
