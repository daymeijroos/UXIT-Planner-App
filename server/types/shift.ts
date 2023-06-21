import type { Shift, Shift_Type, Staff_Required, Staffing } from "@prisma/client"

export interface ShiftWithStaffingsAndStaffRequired extends Shift {
  staffings: (Staffing & { user: User })[]
  staff_required: Staff_Required[]
}

export interface ShiftWithStaffingDetails extends Shift {
  staff_required: (Staff_Required & {
    shift_type: Shift_Type
  })[]
  staffings: Staffing[]
}
