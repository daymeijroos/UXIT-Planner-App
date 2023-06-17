import {createTRPCRouter, protectedProcedure, restrictedProcedure} from "../trpc";
import {Role} from "../../../prisma/role";

export const userRouter = createTRPCRouter({
  getAllUsers: restrictedProcedure(Role.ADMIN).query(({ctx}) => {
    return ctx.prisma.user.findMany()
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
    }),
  getUsersThatAreEmployees: protectedProcedure
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
                availability_week: {
                  include: {
                    availability: {
                      include: {
                        shift_types: true,
                      },
                    },
                  },
                },
              },
            },
            staffings: true,
          },
        });
      })
})
