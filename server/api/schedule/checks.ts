import { getBackupsOnDate } from "../backup"
import { getUserStaffings } from "../user/database-actions"
import { AvailabilityEvenWeek, AvailabilityFlexible, AvailabilityOddWeek, Shift, Shift_Type } from "@prisma/client"
import { SplitDate } from "../../../shared/types/splitDate"
import { UserWithPreferenceAndStaffings } from "../../types/user"
import { getWeekNumber } from './helper-functions'
import { AvailabilityEvenWeekWithAvailability, AvailabilityFlexibleWithAvailability, AvailabilityOddWeekWithAvailability, AvailabilityWithShiftTypes } from "../../types/availability"

export const checkUserFlexibleAvailability = (user: UserWithPreferenceAndStaffings, on: Date): boolean => {
  if (!(user.preference && user.preference.availability_flexible)) return false
  let availability: AvailabilityFlexibleWithAvailability = user.preference.availability_flexible
  const dayOfWeek: number = on.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  return !!availabilityForDay
}

export const checkUserFlexibleAvailabilityForShiftType = (user: UserWithPreferenceAndStaffings, shiftType: Shift_Type, on: Date) => {
  if (!(user.preference && user.preference.availability_flexible)) return false
  let availability: AvailabilityFlexibleWithAvailability = user.preference.availability_flexible
  const dayOfWeek: number = on.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  const isAvailable: boolean = availabilityForDay?.shift_types.includes(shiftType) ?? false
  return isAvailable
}

export const checkUserAvailabilityForShiftType = (user: UserWithPreferenceAndStaffings, shiftType: Shift_Type, on: Date): boolean => {
  if (!user.preference) return false
  let availability: AvailabilityEvenWeekWithAvailability | AvailabilityOddWeekWithAvailability = user.preference.availability_even_week
  if (user.preference.availability_odd_week) {
    const weekNumber: number = getWeekNumber(on)
    const isOddWeek: boolean = weekNumber % 2 === 1
    if (isOddWeek) availability = user.preference.availability_odd_week
  }
  const dayOfWeek: number = on.getDay()
  const availabilityForDay: AvailabilityWithShiftTypes | undefined = availability.availability.find((availability) => availability.weekday === dayOfWeek)
  const isAvailable: boolean = availabilityForDay?.shift_types.includes(shiftType) ?? false
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
  const staffings = await getUserStaffings(user, new Date(new Date(from).setHours(0, 0, 0, 0)), new Date(new Date(to).setHours(23, 59, 59, 999)))
  if (staffings.length > 0) return true
  return false
}

export const checkUserAlreadyStaffedDuringShift = async (user: UserWithPreferenceAndStaffings, shift: Shift) => {
  return checkUserAlreadyStaffed(user, shift.start, shift.end)
}

export const checkEnoughBackupStaff = async (date: Date) => {
  return (await getBackupsOnDate(date)).length >= 2
}