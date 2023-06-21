import { getBackupsOnDate } from "../backup"
import { getUserStaffings } from "../user/database-actions"
import { Shift, Shift_Type } from "@prisma/client"
import { UserWithPreferenceAndStaffings } from "../../types/user"
import { getWeekNumber } from './helper-functions'
import { AvailabilityEvenWeekWithAvailability, AvailabilityFlexibleWithAvailability, AvailabilityOddWeekWithAvailability, AvailabilityWithShiftTypes } from "../../types/availability"
import { prisma } from "../../db"
import { ShiftWithStaffingDetails } from "../../types/shift"

export const checkUserFlexibleAvailability = (user: UserWithPreferenceAndStaffings, date: Date): boolean => {
  if (!(user.preference && user.preference.availability_flexible)) return false
  let availability: AvailabilityFlexibleWithAvailability = user.preference.availability_flexible
  const dayOfWeek: number = date.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  return !!availabilityForDay
}

export const checkUserFlexibleAvailabilityForShiftType = (user: UserWithPreferenceAndStaffings, shiftType: Shift_Type, date: Date) => {
  if (!(user.preference && user.preference.availability_flexible)) return false
  let availability: AvailabilityFlexibleWithAvailability = user.preference.availability_flexible
  const dayOfWeek: number = date.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  const isAvailable: boolean = !!availabilityForDay?.shift_types.find((availabilityShiftType) => availabilityShiftType.id === shiftType.id)
  return isAvailable
}

export const checkUserAvailabilityForShiftType = (user: UserWithPreferenceAndStaffings, shiftType: Shift_Type, date: Date): boolean => {
  if (!user.preference) return false
  let availability: AvailabilityEvenWeekWithAvailability | AvailabilityOddWeekWithAvailability = user.preference.availability_even_week
  if (user.preference.availability_odd_week) {
    const weekNumber: number = getWeekNumber(date)
    const isOddWeek: boolean = weekNumber % 2 === 1
    if (isOddWeek) availability = user.preference.availability_odd_week
  }
  const dayOfWeek: number = date.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  const isAvailable: boolean = !!availabilityForDay?.shift_types.find((availabilityShiftType) => availabilityShiftType.id === shiftType.id)
  return isAvailable
}

export const checkUserAbsent = (user: UserWithPreferenceAndStaffings, from: Date, to: Date) => {
  if (!user.preference) return false
  const absences = user.preference.absence.filter((a) => {
    return a.start <= from && a.end >= to
  })

  if (absences.length <= 0) return false
  return true
}

export const checkUserAbsentDuringShift = async (user: UserWithPreferenceAndStaffings, shift: Shift) => {
  return checkUserAbsent(user, shift.start, shift.end)
}

export const checkUserAlreadyStaffed = async (user: UserWithPreferenceAndStaffings, from: Date, to: Date): Promise<boolean> => {
  const staffings = await getUserStaffings(user, new Date(from.setHours(0, 0, 0, 0)), new Date(new Date(to).setHours(23, 59, 59, 999)))
  if (staffings.length > 0) return true
  return false
}

export const checkUserAlreadyStaffedDuringShift = async (user: UserWithPreferenceAndStaffings, shift: Shift) => {
  return checkUserAlreadyStaffed(user, shift.start, shift.end)
}

export const checkUserAlreadyStaffedForDays = async (user: UserWithPreferenceAndStaffings, startDate: Date, endDate: Date) => {
  const start = new Date(new Date(startDate).setHours(0, 0, 0, 0))
  const end = new Date(new Date(endDate).setHours(23, 59, 59, 999))
  const staffings = await getUserStaffings(user, start, end)
  if (staffings.length > 0) return true
  return false
}

export const checkEnoughBackupStaff = async (date: Date) => {
  return (await getBackupsOnDate(date)).length >= 2
}

export const shiftHasEnoughOpenStaffings = async (shift: ShiftWithStaffingDetails, shiftType: Shift_Type) => {
  const staffingRequiredCount = shift.staff_required.find((staffingRequired) => staffingRequired.shift_type.id === shiftType.id)?.amount ?? 0
  const openStaffingsCount = await prisma.openStaffing.count({
    where: {
      shift: {
        id: shift.id
      },
      shift_type: shiftType
    }
  })
  const staffingCount = await prisma.staffing.count({
    where: {
      shift: {
        id: shift.id
      },
      shift_type: shiftType
    }
  })
  return openStaffingsCount + staffingCount >= staffingRequiredCount
}
