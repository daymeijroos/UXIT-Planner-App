import { createTRPCRouter, restrictedProcedure } from "../trpc"
import { Role } from "../../../prisma/role"
import { z } from "zod"
import { ToastService } from "../../../src/components";

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
      if(!input.name){
        throw new Error("Name is required")
      }
      if(!input.last_name){
        throw new Error("Last name is required")
      }
      if(!input.email){
        throw new Error("Email is required")
      }
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
      let data: {
        name?: string,
        last_name?: string,
        email?: string,
        role?: { connect: { name: string } } | null, // Updated role field
      } = {
        name: undefined,
        last_name: undefined,
        email: undefined,
        role: undefined,
      }

      if (input.name) data.name = input.name.trim().charAt(0).toUpperCase() + input.name.trim().slice(1).toLowerCase()
      if (input.last_name) data.last_name = input.last_name.trim().charAt(0).toUpperCase() + input.last_name.trim().slice(1).toLowerCase()
      if (input.email) data.email = input.email
      if (input.role_name) data.role = { connect: { name: input.role_name } } // Connect to the role by name

      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...data,
        },
      })
    })
})
