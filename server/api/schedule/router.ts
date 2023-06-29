import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure, restrictedProcedure } from "../trpc"
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts"
import { Role } from "../../../prisma/role"
import { generateSchedule } from "./generate-functions"
import { prisma } from "../../db"

export const scheduleRouter = createTRPCRouter({
  getUnfulfilledShifts: publicProcedure
    .query(() => {
      return getUnfulfilledShifts()
    }),
  generate: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      from: z.date(),
      to: z.date(),
    }))
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        generateSchedule(input.from, input.to)
          .then(() => {
            resolve('Success')
          })
          .catch((error) => {
            reject(error)
          })
      })
    }),

  getShiftTypes: publicProcedure
    .query(() => {
      return prisma.shift_Type.findMany({
        select: {
          name: true
        }
      })
    }
    ),
  // return true if  shift by date and starttime
  checkShiftExistsByDate: protectedProcedure
    .input(z.object({
      start: z.date(),
      end: z.date(),
    }))
    .query(async ({ input }) => {
      const shift = await prisma.shift.findFirst({
        where: {
          start: input.start,
          end: input.end,
        }
      })
      if (shift) {
        return true
      } else {
        return false
      }
    }),

  createShift: protectedProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
        staff_required: z.array(
          z.object({
            shift_type: z.string(),
            amount: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const shift = await prisma.shift.create({
        data: {
          start: input.start,
          end: input.end,
          staff_required: {
            create: input.staff_required.map(({ shift_type, amount }) => ({
              amount,
              shift_type: {
                connect: {
                  name: shift_type,
                },
              },
            })),
          },
        },
      })
      return shift
    }),

  // get all shifts
  getAllShifts: protectedProcedure
    .query(() => prisma.shift.findMany()),


})

