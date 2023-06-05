import { Shift, Staff_Required, User } from "@prisma/client";
import { prisma } from "../../db"
import { SplitDate } from '../../../shared/types/splitDate'
import {
  checkUserAbsentDuringShift,
  checkUserAlreadyStaffedDuringShift,
  checkUserAvailabilityForShiftType
} from "../schedule/checks";
import { api } from "../../../src/utils/api";

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

export const getAvailableUsersForStaffing = async (shift: Shift) => {
  const users: User[] = api.user.getUsersWithPreferencesAndStaffings.useQuery()
  const availableUsers: User[] = []
  for (const staff_required of shift.staff_required) {
    for (const user of users) {
      const alreadyStaffed = checkUserAlreadyStaffedDuringShift(user, shift)
      const isDefaultAvailable = checkUserAvailabilityForShiftType(user, staff_required.shift_type, shift.start)
      const isAbsent = checkUserAbsentDuringShift(user, shift)

      if (await alreadyStaffed || await isDefaultAvailable || await isAbsent) continue

      availableUsers.push(user)
    }
  }
  return availableUsers
}
