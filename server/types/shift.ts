import type { Shift, Staffing } from "@prisma/client";

export interface ShiftWithStaffings extends Shift {
  staffings: Staffing[]
}
