import { createTRPCRouter, restrictedProcedure } from "../trpc"
import { Role } from "../../../prisma/role"
import { z } from "zod"

export const userRouter = createTRPCRouter({
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
        },
      })
    }),
  update: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      last_name: z.string().optional(),
      email: z.string().email().optional(),
      role_name: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      const data: {
        name?: string,
        last_name?: string,
        email?: string,
        role_name?: string,
      } = {}

      if (input.name) data.name = input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase()
      if (input.last_name) data.last_name = input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase()
      if (input.email) data.email = input.email.toLowerCase()
      if (input.role_name) data.role_name = input.role_name

      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name ? input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase() : undefined,
          last_name: input.last_name ? input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase() : undefined,
          email: input.email,
          role: input.role_name ? {
            connect: {
              name: input.role_name,
            }
          } : undefined,
        },
      })
    })
})
