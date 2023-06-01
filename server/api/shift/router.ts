import { createTRPCRouter, protectedProcedure } from "../trpc";

export const shiftRouter = createTRPCRouter({
  getAllShifts: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.shift.findMany({
        include: {
          staffings: {
            include: {
              user: true
            }
          }
        }
      });
    })
});
