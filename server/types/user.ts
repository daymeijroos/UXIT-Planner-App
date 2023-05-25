import { Absence, AvailabilityWeek, Staffing, User, User_Preference } from "@prisma/client"
import { AvailabilityWeekWithAvailibilityWithShiftTypes, } from "./availibility"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_week: AvailabilityWeekWithAvailibilityWithShiftTypes[]
  }) | null,
  staffings: Staffing[]
}