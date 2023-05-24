import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  //TODO: protectedProcedure
  getAllUsers: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({})
    })
})
