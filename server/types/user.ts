import { Absence, Availability, AvailabilityEvenWeek, Shift_Type, Staffing, User, User_Preference, AvailabilityOddWeek, AvailabilityFlexible } from "@prisma/client"
import { AvailabilityWeekWithAvailibilityWithShiftTypes, } from "./availibility"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
  availability_even_week: AvailabilityEvenWeek[] & {
    availability: Availability & {
      shift_type: Shift_Type
    }
  },
    availability_odd_week: AvailabilityOddWeek[] & {
      availability: Availability & {
        shift_type: Shift_Type
      }
    },
    availability_flexible: AvailabilityFlexible[] & {
      availability: Availability & {
        shift_type: Shift_Type
      }
    },
}),
staffings: Staffing[]
}