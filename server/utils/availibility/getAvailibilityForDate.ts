import { Availability, Shift_Type } from "@prisma/client";
import { prisma } from "../../db";
import { AvailabilityWithShiftTypes } from "../../types/AvailibilityWithShiftTypes";
import { SplitDate } from "../date/splitDate";

export async function getAvailibilityforDate(availabilities: AvailabilityWithShiftTypes[], date: SplitDate): Promise<AvailabilityWithShiftTypes | undefined> {

  const maxSequenceWeek = Math.max(...availabilities.map(a => a.sequence_week)) + 1;
  console.log(`maxSequenceWeek: ${maxSequenceWeek}`);
  const remainder = date.week % maxSequenceWeek;
  console.log(`remainder: ${remainder}`);

  return availabilities.find((a) => a.sequence_week === remainder && a.weekday === date.weekday);
}