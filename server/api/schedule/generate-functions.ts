import { UserWithPreferenceAndStaffings } from "../../types/user"
import { createBackup, getFirstBackupOnDate } from "../backup"
import { getShifts } from "../shift"
import { createStaffing } from "../staffing"
import { getUsersWithPreferencesAndStaffings } from "../user"
import { checkEnoughBackupStaff, checkReachedMaxStaffings, checkUserAbsent, checkUserAbsentDuringShift, checkUserAlreadyStaffed, checkUserAlreadyStaffedDuringShift, checkUserAvailability, checkUserAvailabilityForShiftType } from "./checks"

export const generateSchedule = async (fromDate: Date, toDate: Date) => {
  const shifts = await getShifts(fromDate, toDate)
  let users = await getUsersWithPreferencesAndStaffings()

  for (const shift of shifts) {
    for (const staff_required of shift.staff_required) {
      const shiftRequiresStaffAmount = staff_required.amount - staff_required.shift.staffings.length

      users = shuffleArray(users)

      for (let i = 1; i <= shiftRequiresStaffAmount; i++) {
        for (const user of users) {
          const alreadyStaffed = checkUserAlreadyStaffedDuringShift(user, shift)
          const isDefaultAvailable = checkUserAvailabilityForShiftType(user, staff_required.shift_type, shift.start)
          const isAbsent = checkUserAbsentDuringShift(user, shift)
          const reachedMax = checkReachedMaxStaffings(user, shift.start)

          if (await alreadyStaffed || await isDefaultAvailable || await isAbsent || await reachedMax) {
            continue
          }

          await createStaffing(user, shift, staff_required)
          break
        }
      }
    }
  }
  await generateBackupSchedule(fromDate, toDate)
  console.log('Schedule generated')
  return
}

export const generateBackupSchedule = async (fromDate: Date, toDate: Date) => {
  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
  const users = await getUsersWithPreferencesAndStaffings()

  for (let i = 0; i <= days; i++) {
    const dayStart = new Date(fromDate.getTime() + (i * 1000 * 60 * 60 * 24))
    const dayEnd = new Date(fromDate.getTime() + ((i + 1) * 1000 * 60 * 60 * 24))

    for (const user of users) {
      const enoughBackup = checkEnoughBackupStaff(dayStart)

      if (!await enoughBackup) break

      const userIsBackup = getFirstBackupOnDate(dayStart, { user: user })
      const alreadyStaffed = checkUserAlreadyStaffed(user, dayStart, dayEnd)
      const isDefaultAvailable = checkUserAvailability(user, dayStart)
      const isAbsent = checkUserAbsent(user, dayStart, dayEnd)
      const reachedMax = checkReachedMaxStaffings(user, dayStart)

      if (await alreadyStaffed || !await isDefaultAvailable || await isAbsent || await reachedMax || await userIsBackup) continue

      await createBackup({ user, date: dayStart })
    }
  }
  return
}

function shuffleArray(array: UserWithPreferenceAndStaffings[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
