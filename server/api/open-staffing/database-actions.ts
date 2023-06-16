import { Shift, Shift_Type } from "@prisma/client"
import { prisma } from "../../db"

export const findFirstOpenStaffingForShift = async (shift: Shift, shift_type: Shift_Type) => {
  return prisma.openStaffing.findFirst({
    where: {
      shift_id: shift.id,
      shift_type_id: shift_type.id
    }
  })
}
