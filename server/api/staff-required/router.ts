import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const staffRequiredRouter = createTRPCRouter({
  createRequiredStaffing: publicProcedure
    .input(
      z.object({
        shift_id: z.string(),
        amountOfStaffRequired: z.number(),
        shift_type_id: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.staff_Required.create({
        data: {
          amount: input.amountOfStaffRequired,
          shift: {
            connect: {
              id: input.shift_id
            }
          },
          shift_type: {
            connect: {
              id: input.shift_type_id
            }
          }
        },
      })
    }),
  updateRequiredStaffing: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amountOfStaffRequired: z.number(),
        shiftType_id: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.staff_Required.update({
        where: {
          id: input.id
        },
        data: {
          amount: input.amountOfStaffRequired,
          shift_type: {
            connect: {
              id: input.shiftType_id
            }
          }
        }
      })
    }),
})
