import { Staffing, User } from '@prisma/client'
import { prisma } from "../../db"
import { SplitDate } from '../../../shared/types/splitDate'
import { UserWithPreferenceAndStaffings } from '../../types/user'

export async function getUsersWithPreferencesAndStaffings(): Promise<UserWithPreferenceAndStaffings[]> {
  return prisma.user.findMany({
    include: {
      preference: {
        include: {
          absence: true,
          availability_even_week: {
            include: {
              availability: true,
            },
          },
          availability_odd_week: {
            include: {
              availability: true,
            },
          },
          availability_flexible: {
            include: {
              availability: true,
            },
          },
        },
      },
      staffings: true,
    },
  })
}

export async function getUserStaffingsForWeek(user: User, start: SplitDate): Promise<number> {
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

export async function getUserStaffings(user: User, from: Date, to: Date): Promise<Staffing[]> {
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
