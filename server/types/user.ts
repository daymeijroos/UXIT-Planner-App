import { Absence, Availability, AvailabilityEvenWeek, AvailabilityFlexible, AvailabilityOddWeek, Shift_Type, Staffing, User, User_Preference } from "@prisma/client"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_even_week: AvailabilityEvenWeek & {
      availability: (Availability & {
        shift_types: Shift_Type[]
      })[]
    },
    availability_odd_week: AvailabilityOddWeek & {
      availability: (Availability & {
        shift_types: Shift_Type[]
      })[],
    } | null,
    availability_flexible: AvailabilityFlexible & {
      availability: (Availability & {
        shift_types: Shift_Type[]
      })[],
    } | null,
  }) | null,
  staffings: Staffing[]
}