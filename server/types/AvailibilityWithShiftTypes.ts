import { Availability, Shift_Type } from "@prisma/client";

export interface AvailabilityWithShiftTypes extends Availability {
  shift_types: Shift_Type[];
}