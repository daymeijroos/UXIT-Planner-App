import { createTRPCRouter, protectedProcedure, restrictedProcedure } from "../trpc";
import { z } from "zod";
import { getAvailableUsersForStaffing } from "./database-actions";
import type { Shift } from "@prisma/client";
import { Staff_Required, User } from "@prisma/client";
import { Role } from "../../../prisma/role";

export const userRouter = createTRPCRouter({
  getAllUsers: restrictedProcedure(Role.ADMIN).query(({ctx}) => {
    return ctx.prisma.user.findMany()
  }),
  getUsersWithPreferencesAndStaffings: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        include: {
          preference: {
            include: {
              absence: true,
              availability_week: {
                include: {
                  availability: {
                    include: {
                      shift_types: true
                    }
                  }
                }
              }
            }
          },
          staffings: true
        }
      });
    }),
  getAvailableUsers: protectedProcedure
    .input(z.object({
      shift_id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const shift: Shift = ctx.prisma.shift.findUnique({
        where: {
          id: input.shift_id
        }
      })
      const shiftType = await ctx.prisma.shift_Type.findUnique({
        where: {
          name: "Balie"
        }
      })
      return getAvailableUsersForStaffing(shift, shiftType.id)
    })
})
