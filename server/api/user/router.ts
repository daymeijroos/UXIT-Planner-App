import { createTRPCRouter, restrictedProcedure } from "../trpc";
import { Role } from "../../../prisma/role"

export const userRouter = createTRPCRouter({
  getAllUsers: restrictedProcedure(Role.ADMIN).query(({ctx}) => {
    return ctx.prisma.user.findMany()
  }),
});
