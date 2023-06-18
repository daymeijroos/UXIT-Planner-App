import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const openStaffingRouter = createTRPCRouter({
  getOpenStaffing: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.openStaffing.findUnique({
        where: {
          id: input.id
        },
        include: {
          shift: true,
          absent_user: true,
        }
      })
    }),
})
