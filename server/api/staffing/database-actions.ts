import { prisma } from "../../db"
import type { OpenStaffing, Shift, Shift_Type, Staffing, User } from "@prisma/client"

export const createStaffing = async (user: User, openStaffing: OpenStaffing): Promise<Staffing> => {
  const staffing = await prisma.staffing.create({
    data: {
      shift: {
        connect: {
          id: openStaffing.shift_id,
        },
      },
      shift_type: {
        connect: {
          id: openStaffing.shift_type_id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      }
    },
  })
  if (staffing) prisma.openStaffing.delete({
    where: {
      id: openStaffing.id
    }
  })
  return staffing
}

export const createOpenStaffing = async (shift: Shift, shiftType: Shift_Type): Promise<OpenStaffing> => {
  return prisma.openStaffing.create({
    data: {
      shift: {
        connect: {
          id: shift.id,
        },
      },
      shift_type: {
        connect: {
          id: shiftType.id,
        },
      },
    },
  })
}