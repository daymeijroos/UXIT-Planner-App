import type { Availability, AvailabilityFlexible, AvailabilityEvenWeek, AvailabilityOddWeek, Shift_Type } from "@prisma/client"

export interface AvailabilityWithShiftTypes extends Availability {
  shift_types: Shift_Type[]
}


export interface AvailabilityEvenWeekWithAvailability extends AvailabilityEvenWeek {
  availability: (Availability & {
    shift_types: Shift_Type[]
  })[]
}

export interface AvailabilityOddWeekWithAvailability extends AvailabilityOddWeek {
  availability: (Availability & {
    shift_types: Shift_Type[]
  })[]
}

export interface AvailabilityFlexibleWithAvailability extends AvailabilityFlexible {
  availability: (Availability & {
    shift_types: Shift_Type[]
  })[]
}
