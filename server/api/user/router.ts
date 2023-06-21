import {createTRPCRouter, protectedProcedure, restrictedProcedure} from "../trpc";
import {Role} from "../../../prisma/role";

export const userRouter = createTRPCRouter({
  getAllUsers: restrictedProcedure(Role.ADMIN).query(({ctx}) => {
    return ctx.prisma.user.findMany()
  }),
  getUsersWithPreferencesAndStaffings: restrictedProcedure(Role.ADMIN)
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        include: {
          preference: {
            include: {
              absence: true,
            }
          },
          staffings: true
        }
      });
    }),
  getUsersThatAreEmployees: restrictedProcedure(Role.ADMIN)
      .query(({ctx}) => {
        return ctx.prisma.user.findMany({
          where: {
            role: {
              name: 'EMPLOYEE',
            },
          },
          include: {
            preference: {
              include: {
                absence: true,
              },
            },
            staffings: true,
          },
        });
      })
})
