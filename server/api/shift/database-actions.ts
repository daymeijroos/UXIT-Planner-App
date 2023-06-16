import { prisma } from "../../db"
import { ShiftWithStaffingDetails } from "../../types/shift"

export async function getShifts(fromDate?: Date, toDate?: Date): Promise<ShiftWithStaffingDetails[]> {
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
        },
      },
      staffings: true,
    }
  })
}