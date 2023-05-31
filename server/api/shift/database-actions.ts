import { prisma } from "../../db"

export const getShifts = async (fromDate?: Date, toDate?: Date) => {
  return prisma.shift.findMany({
    where: {
      start: {
        gte: fromDate,
      },
      end: {
        lte: toDate,
      },
    },
    include: {
      staff_required: {
        include: {
          shift_type: true,
          shift: {
            include: {
              staffings: true,
            }
          }
        },
      }
    }
  })
}