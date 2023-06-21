import type { StaffingWithColleagues } from "../types/StaffingWithColleagues";

export function formatShiftStaffList(staffing: StaffingWithColleagues) {
  const shifts: { [key: string]: string[] } = {};

  staffing.shift.staffings.forEach(nestedStaffing => {
    const shiftTypeName = nestedStaffing.shift_type.name;

    if (!shifts[shiftTypeName]) {
      shifts[shiftTypeName] = [];
    }

    const staffName = `${nestedStaffing.user.name ?? 'Onbekende naam'}`;

    shifts[shiftTypeName].push(staffName);
  });

  const formattedShifts = Object.entries(shifts).map(([shiftTypeName, staffNames]) => {
    const formattedStaffNames = staffNames.join(', ');
    return `${shiftTypeName}: ${formattedStaffNames}`;
  }).join('\n').split('\n')
    .map((line, index) => <span key={index}>{line}<br /></span>);

  return formattedShifts;
}
