import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({})
    })
})
