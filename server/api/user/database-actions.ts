import { User } from '@prisma/client'
import { prisma } from "../../db"
import { SplitDate } from '../../../shared/types/splitDate'

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
