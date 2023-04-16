import { Availability, Shift, Staffing, User } from "@prisma/client";
import { prisma } from "../db";

export async function getStaffings(shiftId: string, shiftTypeId: string): Promise<number> {
  return await prisma.staffing.count({
    where: { shift_id: shiftId, shift_type_id: shiftTypeId },
  });
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export async function getAvailabilityForWeek(userId: string, weekNumber: number) {
  const userPreference = await prisma.user_Preference.findUnique({
    where: { user_id: userId },
  });
  
  if (!userPreference) return null;
  
  let availability = await prisma.availability.findFirst({
    where: { preference_id: userPreference.id, sequence_start: true },
    include: { shift_types: true },
  });
  
  let sequenceCount = 1;
  let dayOfWeek = 1;
  while (sequenceCount < weekNumber && availability && availability.next_id) {
    availability = await prisma.availability.findUnique({
      where: { id: availability.next_id },
      include: { shift_types: true },
    });
    if (!availability) break;
    if (availability.weekday < dayOfWeek) {
      dayOfWeek = availability?.weekday;
      sequenceCount++;
    }
  }
  
  return availability;
}

function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay() || 7;
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export async function userHasReachedMaxHours(userId: string, shiftTypeId: string, date: Date): Promise<boolean> {
  const weekNumber = getWeekNumber(date);
  const absence = await getAvailabilityForWeek(userId, weekNumber);
  const userPreference = await prisma.user_Preference.findUnique({ where: { user_id: userId } });
  
  if (!absence) return true;
  if (!userPreference) return true;
  
  const shiftStartDate = getStartOfWeek(date);
  const scheduledHours = await prisma.staffing.count({
    where: {
      user_id: userId,
      shift_type_id: shiftTypeId,
      shift: {
        start: {
          gte: shiftStartDate,
          lt: new Date(shiftStartDate.getFullYear(), shiftStartDate.getMonth(), shiftStartDate.getDate() + 7, 0, 0, 0),
        },
      },
    },
  });
  
  return scheduledHours >= userPreference.preferedWorkHours;
}

async function findUserForShiftTypeOnDate(shiftTypeId: string, date: Date): Promise<User | null> {
  const weekNumber = getWeekNumber(date);
  
  const users = await prisma.user.findMany({
    where: { preference: { shift_type_id: shiftTypeId } },
  });
  
  for (const user of users) {
    if (!(await userHasReachedMaxHours(user.id, shiftTypeId, date))) {
      return user;
    }
  }
  
  return null;
}

async function createStaffing(shiftId: string, shiftTypeId: string, userId: string): Promise<Staffing> {
  return await prisma.staffing.create({
    data: {
      shift_id: shiftId,
      shift_type_id: shiftTypeId,
      user_id: userId,
    },
  });
}

async function processStaffRequiredForShift(shift: Shift): Promise<void> {
  const staffRequiredList = await prisma.staff_Required.findMany({ where: { shift_id: shift.id } });
  
  for (const staffRequired of staffRequiredList) {
    const staffingsCount = await getStaffings(shift.id, staffRequired.shift_type_id);
    const requiredCount = staffRequired.amount;
    const remainingStaffCount = requiredCount - staffingsCount;
    
    for (let i = 0; i < remainingStaffCount; i++) {
      const user = await findUserForShiftTypeOnDate(staffRequired.shift_type_id, shift.start);
      
      if (user) {
        await createStaffing(shift.id, staffRequired.shift_type_id, user.id);
      } else {
        console.log(`No suitable user found for shift type ${staffRequired.shift_type_id} on ${shift.start}`);
      }
    }
  }
}

export default async function processAllShifts(fromDate?: Date, toDate?: Date): Promise<void> {
  let params = {}
  if (fromDate && toDate) {
    params = {
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
  const shifts = await prisma.shift.findMany(params);
  console.log(`Processing ${shifts.length} shifts`);
  
  for (const shift of shifts) {
    await processStaffRequiredForShift(shift);
  }
}