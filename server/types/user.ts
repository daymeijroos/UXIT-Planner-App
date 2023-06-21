import { Absence, Availability, AvailabilityEvenWeek, Shift_Type, Staffing, User, User_Preference } from "@prisma/client"
import { AvailabilityWeekWithAvailabilityWithShiftTypes, } from "./availibility"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_even_week: AvailabilityEvenWeek[] & {
      availability: Availability & {
        shift_type: Shift_Type
      }
    }
  }),
  staffings: Staffing[]
}
