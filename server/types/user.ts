import { Absence, AvailabilityWeek, Staffing, User, User_Preference } from "@prisma/client"
import { AvailabilityWeekWithAvailabilityWithShiftTypes, } from "./availibility"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_even_week: AvailabilityWeekWithAvailabilityWithShiftTypes[]
  }) | null,
  staffings: Staffing[]
}
