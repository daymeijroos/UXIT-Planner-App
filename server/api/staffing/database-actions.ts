import { User } from "@prisma/client"
import { prisma } from "../../db"
import { Shift, Staff_Required } from "@prisma/client"

export const createStaffing = async (user: User, shift: Shift, staff_required: Staff_Required) => {
  return prisma.staffing.create({
    data: {
      shift: {
        connect: {
          id: shift.id,
        },
      },
      shift_type: {
        connect: {
          id: staff_required.shift_type_id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      }
    },
  })
}