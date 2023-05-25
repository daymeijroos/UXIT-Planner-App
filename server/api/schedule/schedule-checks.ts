import { Shift, Shift_Type, Staff_Required } from "@prisma/client"
import { UserWithPreferenceAndStaffings } from "../../types/user"
import { SplitDate } from "../../../shared/types/splitDate"
import { getAvailabilityForDate } from "../availibility"
import { getStaffingsOnStaffRequired, getUserStaffings, getUserStaffingsForWeek } from "./schedule-database-actions"
import { getBackupsOnDate } from "../backup"

export const checkUserAvailability = async (user: UserWithPreferenceAndStaffings, on: Date) => {
  if (!user.preference) return false
  const onSplit = SplitDate.fromDate(on)

  const availibility = await getAvailabilityForDate(user.preference.availability_week, onSplit)
  return !!availibility
}

export const checkUserAvailabilityForShiftType = async (user: UserWithPreferenceAndStaffings, shiftType: Shift_Type, on: Date) => {
  if (!user.preference) return false
  const onSplit = SplitDate.fromDate(on)

  const availibility = await getAvailabilityForDate(user.preference.availability_week, onSplit)
  if (!availibility) return false
  if (!availibility.shift_types.find((st) => st.id === shiftType.id)) return false
  return true
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

export const checkStaffRequired = async (staff_required: Staff_Required) => {
  const staffingsForShift = await getStaffingsOnStaffRequired(staff_required)
  return staff_required.amount - staffingsForShift.length
}

export const checkReachedMaxStaffings = async (user: UserWithPreferenceAndStaffings, start: Date) => {
  const startSplit = SplitDate.fromDate(start)
  const maxStaffings = user.preference?.maxStaffings || 0
  const amountStaffed = await getUserStaffingsForWeek(user, startSplit)
  if (maxStaffings === 0) return false
  if (amountStaffed < maxStaffings) return false
  return true
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

