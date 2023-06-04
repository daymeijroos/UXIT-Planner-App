import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getUsersWithPreferencesAndStaffings } from "./database-actions";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({});
    }),
  getUsersWithPreferencesAndStaffings: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        include: {
          preference: {
            include: {
              absence: true,
              availability_week: {
                include: {
                  availability: {
                    include: {
                      shift_types: true
                    }
                  }
                }
              }
            }
          },
          staffings: true
        }
      });
    })
})
