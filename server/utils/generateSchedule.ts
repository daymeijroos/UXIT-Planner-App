import { Absence, Shift, Shift_Type, Staff_Required, Staffing, User, User_Preference } from "@prisma/client";
import { prisma } from "../db";
import { SplitDate } from "../../shared/types/splitDate";
import { AvailabilityWithShiftTypes } from "../types/AvailibilityWithShiftTypes";
import { getAvailibilityforDate } from "./availibility/getAvailibilityForDate";

export const generateSchedule = async (fromDate?: Date, toDate?: Date) => {
  const shifts = await getShifts(fromDate, toDate);
  const users = await getUsers();
  if (!shifts || !users) return
  console.log(`Processing ${shifts.length} shifts`);

  for (const shift of shifts) {
    console.log(`Processing shift ${shift.id}`);

    for (const sr of shift.staff_required) {
      const staffRequired = await checkStaffRequired(sr);
      if (staffRequired === 0) continue;

      for (let i = 0; i < staffRequired; i++) {
        for (const user of users) {
          const alreadyStaffed = await checkUserAlreadyStaffed(user, shift);
          if (alreadyStaffed) continue;
          const isDefaultAvailable = await checkUserDefaultAvailabilityForShiftType(user, sr.shift_type, shift.start, shift.end);
          if (!isDefaultAvailable) continue;
          const isAbsent = await checkUserAbsent(user, shift.start, shift.end);
          if (isAbsent) continue;
          const reachedMax = await reachedMaxStaffings(user, shift.start);
          if (reachedMax) continue;

          const staffing = {
            shift_id: shift.id,
            shift_type_id: sr.shift_type_id,
            user_id: user.id,
          }

          await prisma.staffing.create({
            data: staffing,
          });
          break;
        }
      }
    }
  }
  console.log("Done");
  return;
}

const getShifts = async (fromDate?: Date, toDate?: Date) => {
  let dateParams = {}
  if (fromDate && toDate) {
    dateParams = {
      where: {
        start: {
          gte: fromDate,
        },
        end: {
          lte: toDate,
        },
      }
    };
  }
  return await prisma.shift.findMany({...dateParams, include: { 
    staff_required: {
      include: {
        shift_type: true,
      },
    } 
  }});
}

export interface UserExtended extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability: AvailabilityWithShiftTypes[]
  }) | null,
  staffings: Staffing[]
}

const getUsers = async () => {
  return await prisma.user.findMany({
    include: {
      preference: {
        include: {
          absence: true,
          availability: {
            include: {
              shift_types: true,
            },
          },
        },
      },
      staffings: true,
    },
  });
}

const checkUserDefaultAvailabilityForShiftType = async (user: UserExtended, shiftType: Shift_Type, startDate: Date, endDate: Date): Promise<boolean> => {
  if (!user.preference) return false;
  const startDateSplit = SplitDate.fromDate(startDate);
  const endDateSplit = SplitDate.fromDate(endDate);
  const startWeekday = startDateSplit.weekday;
  const endWeekday = endDateSplit.weekday;

  const availibility = await getAvailibilityforDate(user.preference.availability, startDateSplit);
  if (!availibility) return false;
  if (!availibility.shift_types.find((st) => st.id === shiftType.id)) return false;
  return true
}

const checkUserAbsent = async (user: UserExtended, startDate: Date, endDate: Date): Promise<boolean> => {
  if (!user.preference) return false;
  const absences = user.preference.absence.filter((a) => {
    return a.start <= startDate && a.end >= endDate;
  });

  if (absences.length <= 0) return false;
  return true;
}

const checkStaffRequired = async (staff_required: Staff_Required): Promise<number> => {
  const staffingsForShift = await prisma.staffing.findMany({
    where: {
      shift_id: staff_required.shift_id,
      shift_type_id: staff_required.shift_type_id,
    },
  });

  return staff_required.amount - staffingsForShift.length
}

const reachedMaxStaffings = async (user: UserExtended, startDate: Date): Promise<boolean> => {
  const startDateSplit = SplitDate.fromDate(startDate);
  const maxStaffings = user.preference?.maxStaffings || 0;
  const amountStaffed  = await prisma.staffing.count({
    where: {
      user_id: user.id,
      shift: {
        start: {
          gte: startDateSplit.getWeekStart(),
        },
        end: {
          lte: startDateSplit.getWeekEnd(),
        },
      },
    },
  });
  if (maxStaffings === 0) return false;
  if (amountStaffed < maxStaffings) return false;
  return true;
}

const checkUserAlreadyStaffed = async (user: UserExtended, shift: Shift): Promise<boolean> => {
  const staffings = await prisma.staffing.findMany({
    where: {
      user_id: user.id,
      shift_id: shift.id,
    },
  });

  if (staffings.length > 0) return true;
  return false;
}