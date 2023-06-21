import {createTRPCRouter, restrictedProcedure} from "../trpc";
import { Role } from "../../../prisma/role"
import { z } from "zod"

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
      }),
  getAll: restrictedProcedure(Role.ADMIN)
      .query(({ ctx }) => {
        return ctx.prisma.user.findMany()
      }),
  create: restrictedProcedure(Role.ADMIN)
      .input(z.object({
        name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
      }))
      .mutation(({ ctx, input }) => {
        return ctx.prisma.user.create({
          data: {
            name: input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase(),
            last_name: input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase(),
            email: input.email,
            preference: {
              create: {
                availability_even_week: {
                  create: true,
                }
              },
            },
          },
        })
      }),
  update: restrictedProcedure(Role.ADMIN)
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().email().optional(),
      }))
      .mutation(({ ctx, input }) => {
        let data: {
          name?: string,
          last_name?: string,
          email?: string,
        } = {
          name: undefined,
          last_name: undefined,
          email: undefined,
        }

        if (input.name) data.name = input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase()
        if (input.last_name) data.last_name = input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase()
        if (input.email) data.email = input.email

        return ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name ? input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase() : undefined,
            last_name: input.last_name ? input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase() : undefined,
            email: input.email,
          },
        })
      })
})
