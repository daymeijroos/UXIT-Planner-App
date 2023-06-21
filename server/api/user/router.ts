import { createTRPCRouter, restrictedProcedure } from "../trpc";
import { Role } from "../../../prisma/role"
import { getUserPreferences } from "./database-actions";

export const userRouter = createTRPCRouter({
  getAllUsers: restrictedProcedure(Role.ADMIN)
    .query(({ctx}) => {
      return ctx.prisma.user.findMany()
    }),
  getAllUserWithPreferences: restrictedProcedure(Role.ADMIN)
    .query(({ctx, input}) => {
      return getUserPreferences()
    }),
});
