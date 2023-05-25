import { Shift, Staff_Required, User } from '@prisma/client'
import { prisma } from "../../db"
import { SplitDate } from '../../../shared/types/splitDate'

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
        },
      }
    }
  })
}

export const getUsersWithPreferencesAndStaffings = async () => {
  return prisma.user.findMany({
    include: {
      preference: {
        include: {
          absence: true,
          availability_week: {
            include: {
              availability: {
                include: {
                  shift_types: true,
                }
              }
            },
          },
        },
      },
      staffings: true,
    },
  })
}

export const getStaffingsOnStaffRequired = async (staffRequired: Staff_Required) => {
  return prisma.staffing.findMany({
    where: {
      shift_id: staffRequired.shift_id,
      shift_type_id: staffRequired.shift_type_id,
    },
  })
}

export const getUserStaffingsForWeek = async (user: User, start: SplitDate) => {
  return prisma.staffing.count({
    where: {
      user_id: user.id,
      shift: {
        start: {
          gte: start.getWeekStart(),
        },
        end: {
          lte: start.getWeekEnd(),
        },
      },
    },
  })
}

export const getUserStaffings = async (user: User, from: Date, to: Date) => {
  return prisma.staffing.findMany({
    where: {
      user_id: user.id,
      shift: {
        start: {
          gte: from
        },
        end: {
          lte: to,
        },
      },
    },
  })
}

export const createStaffing = async (user: User, shift: Shift, staff_required: Staff_Required) => {
  return prisma.staffing.create({
    data: {
      shift_id: shift.id,
      shift_type_id: staff_required.shift_type_id,
      user_id: user.id,
    },
  })
}