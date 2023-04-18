import { AvailabilityWithShiftTypes } from "../../types/AvailibilityWithShiftTypes";
import { SplitDate } from "../../../shared/types/splitDate";

export async function getAvailibilityforDate(availabilities: AvailabilityWithShiftTypes[], date: SplitDate): Promise<AvailabilityWithShiftTypes | undefined> {
  const maxSequenceWeek = Math.max(...availabilities.map(a => a.sequence_week)) + 1;
  const remainder = date.week % maxSequenceWeek;

  return availabilities.find((a) => a.sequence_week === remainder && a.weekday === date.weekday);
}