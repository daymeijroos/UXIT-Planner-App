import { createTRPCRouter, restrictedProcedure } from "../trpc"
import { Role } from "../../../prisma/role"
import { z } from "zod"
import { ToastService } from "../../../src/components";

export const roleRouter = createTRPCRouter({
  getAll: restrictedProcedure(Role.ADMIN)
    .query(({ ctx }) => {
      return ctx.prisma.role.findMany()
    })
})
