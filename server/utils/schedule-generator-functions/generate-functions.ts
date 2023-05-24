import { checkEnoughBackupStaff, checkReachedMaxStaffings, checkStaffRequired, checkUserAbsent, checkUserAbsentDuringShift, checkUserAlreadyStaffed, checkUserAlreadyStaffedDuringShift, checkUserAvailability, checkUserAvailabilityForShiftType } from "./checks";
import { checkUserIsBackup, createBackup, createStaffing, getShifts, getUsersWithPreferencesAndStaffings } from "./database-actions";

export const generateSchedule = async (fromDate: Date, toDate: Date) => {
  const shifts = await getShifts(fromDate, toDate);
  const users = await getUsersWithPreferencesAndStaffings();
  for (const shift of shifts) {
    for (const staff_required of shift.staff_required) {
      const staffRequired = await checkStaffRequired(staff_required);
      for (let i = 0; i <= staffRequired; i++) {
        for (const user of users) {
          const alreadyStaffed = checkUserAlreadyStaffedDuringShift(user, shift);
          const isDefaultAvailable = checkUserAvailabilityForShiftType(user, staff_required.shift_type, shift.start);
          const isAbsent = checkUserAbsentDuringShift(user, shift);
          const reachedMax = checkReachedMaxStaffings(user, shift.start);
          if (await alreadyStaffed || await isDefaultAvailable || await isAbsent || await reachedMax) continue;

          await createStaffing(user, shift, staff_required);
          break;
        }
      }
    }
  }
  await generateBackupSchedule(fromDate, toDate);
  return;
}

export const generateBackupSchedule = async (fromDate: Date, toDate: Date) => {
  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
  const users = await getUsersWithPreferencesAndStaffings()

  for (let i = 0; i <= days; i++) {
    const dayStart = new Date(fromDate.getTime() + (i * 1000 * 60 * 60 * 24))
    const dayEnd = new Date(fromDate.getTime() + ((i + 1) * 1000 * 60 * 60 * 24))

    for (const user of users) {
      const enoughBackup = checkEnoughBackupStaff(dayStart)
      if (!await enoughBackup) break;
      const userIsBackup = checkUserIsBackup(user, dayStart)
      const alreadyStaffed = checkUserAlreadyStaffed(user, dayStart, dayEnd)
      const isDefaultAvailable = checkUserAvailability(user, dayStart)
      const isAbsent = checkUserAbsent(user, dayStart, dayEnd)
      const reachedMax = checkReachedMaxStaffings(user, dayStart)
      if (await enoughBackup || await alreadyStaffed || await isDefaultAvailable || await isAbsent || await reachedMax) continue

      await createBackup(user, dayStart);
    }
  }
  return;
}