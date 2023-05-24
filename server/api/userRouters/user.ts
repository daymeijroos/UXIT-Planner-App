import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({})
    })
})
