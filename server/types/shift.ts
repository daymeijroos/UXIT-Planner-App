import type { Shift, Staffing, User, Staff_Required } from "@prisma/client";

export interface ShiftWithStaffingsAndStaffRequired extends Shift {
  staffings: (Staffing & { user: User })[]
  staff_required: Staff_Required[]
}
