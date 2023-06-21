import { Absence, Staffing, User, User_Preference } from "@prisma/client"
import { AvailabilityWeekWithAvailabilityWithShiftTypes, } from "./availability"

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_week: AvailabilityWeekWithAvailabilityWithShiftTypes[]
  }) | null,
  staffings: Staffing[]
}
