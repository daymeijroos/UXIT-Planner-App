import { Availability, AvailabilityWeek, Shift_Type } from "@prisma/client";

export interface AvailabilityWeekWithAvailibilityWithShiftTypes extends AvailabilityWeek {
  availability: AvailabilityWithShiftTypes[];
}

export interface AvailabilityWithShiftTypes extends Availability {
  shift_types: Shift_Type[];
}