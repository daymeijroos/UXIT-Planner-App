import { Staffing } from '@prisma/client'
import { OpenStaffing } from '@prisma/client'
import { ShiftWithStaffingDetails } from "../../types/shift"
import { UserWithPreferenceAndStaffings } from "../../types/user"
import { createBackup, getFirstBackupOnDate } from "../backup"
import { getShifts } from "../shift"
import { createOpenStaffing, createStaffing } from "../staffing"
import { getUsersWithPreferencesAndStaffings } from "../user"

import { checkEnoughBackupStaff, checkUserAbsent, checkUserAbsentDuringShift, checkUserAlreadyStaffed, checkUserAlreadyStaffedDuringShift, checkUserAvailabilityForShiftType, checkUserFlexibleAvailability, checkUserFlexibleAvailabilityForShiftType } from "./checks"

export const generateSchedule = async (fromDate: Date, toDate: Date) => {
  await generateShiftSchedule(fromDate, toDate)
  //Two backups per day needed💀
  await generateBackupSchedule(fromDate, toDate)
  await generateBackupSchedule(fromDate, toDate)
  return
}

const generateShiftSchedule = async (fromDate: Date, toDate: Date) => {
  const shifts: ShiftWithStaffingDetails[] = await getShifts(fromDate, toDate)
  let users: UserWithPreferenceAndStaffings[] = await getUsersWithPreferencesAndStaffings()

  for (const shift of shifts) {
    for (const staff_required of shift.staff_required) {
      const shiftRequiresStaffAmount = staff_required.amount - shift.staffings.length
      const openStaffing: OpenStaffing = await createOpenStaffing(shift, staff_required.shift_type)
      for (let i = 1; i <= shiftRequiresStaffAmount; i++) {
        let staffing: Staffing | undefined
        for (const user of users) {
          const isDefaultAvailable = checkUserAvailabilityForShiftType(user, staff_required.shift_type, shift.start)
          const alreadyStaffed = checkUserAlreadyStaffedDuringShift(user, shift)
          const isAbsent = checkUserAbsentDuringShift(user, shift)

          if (!(await isDefaultAvailable) || await alreadyStaffed || await isAbsent) {
            continue
          }

          staffing = await createStaffing(user, openStaffing)
          break
        }
        if (staffing) continue
        for (const user of users) {
          users = shuffleArray(users)
          const isFlexibleAvailable = checkUserFlexibleAvailabilityForShiftType(user, staff_required.shift_type, shift.start)
          const alreadyStaffed = checkUserAlreadyStaffedDuringShift(user, shift)
          const isAbsent = checkUserAbsentDuringShift(user, shift)

          if (!(await isFlexibleAvailable) || await alreadyStaffed || await isAbsent) {
            continue
          }

          staffing = await createStaffing(user, openStaffing)
          break
        }
      }
    }
  }
}

const generateBackupSchedule = async (fromDate: Date, toDate: Date) => {
  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
  const users = await getUsersWithPreferencesAndStaffings()

  for (let i = 0; i <= days; i++) {
    const dayStart = new Date(fromDate.getTime() + (i * 1000 * 60 * 60 * 24))
    const dayEnd = new Date(fromDate.getTime() + ((i + 1) * 1000 * 60 * 60 * 24))

    for (const user of users) {
      const enoughBackup = checkEnoughBackupStaff(dayStart)

      if (!await enoughBackup) break

      const isDefaultAvailable = checkUserFlexibleAvailability(user, dayStart)
      const userIsBackup = getFirstBackupOnDate(dayStart, { user: user })
      const alreadyStaffed = checkUserAlreadyStaffed(user, dayStart, dayEnd)
      const isAbsent = checkUserAbsent(user, dayStart, dayEnd)

      if (!(await isDefaultAvailable) || await alreadyStaffed || await isAbsent || await userIsBackup) continue

      await createBackup({ user, date: dayStart })
    }
  }
  return
}

function shuffleArray(array: UserWithPreferenceAndStaffings[]) {
  for (var index = array.length - 1; index > 0; index--) {
    var randomIndex = Math.floor(Math.random() * (index + 1))
    var temp = array[index]
    array[index] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}