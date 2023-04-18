import { Shift, Shift_Type, Staffing } from "@prisma/client"

export interface StaffingWithColleagues extends Staffing {
  shift: Shift & {
    staffings: {
      user: {
        id: string,
        first_name: string | null,
      },
      shift_type: Shift_Type
    }[]
  },
  shift_type: Shift_Type,
}