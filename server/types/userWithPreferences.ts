import { Absence, Availability, AvailabilityEvenWeek, Shift_Type, User, User_Preference } from "@prisma/client";

export interface UserWithPreferenceAndStaffings extends User {
  preference: (User_Preference & {
    absence: Absence[],
    availability_even_week: AvailabilityEvenWeek & {
      availability: Availability & {
        shift_types: Shift_Type[]
      }
    }[]
  }),
}
