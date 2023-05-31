import type { StaffingWithColleagues } from "../../../types/StaffingWithColleagues"
import { formatDate } from "../../../utils/date/formatDate"
import { formatTime } from "../../../utils/date/formatTime"
import { formatShiftStaffList } from "../../../utils/formatShiftStaffList"
import { Card } from "../../atoms"

export function StaffingCard(props: { staffing: StaffingWithColleagues }) {
  return (
    <Card>
      <h1 className="text-2xl font-bold">
        {
          `${formatTime(props.staffing.shift.start)}-${formatTime(props.staffing.shift.end)}`
        }
      </h1>
      <p>
        {
          `${formatDate(props.staffing.shift.start)[0].toUpperCase()}${formatDate(props.staffing.shift.start).slice(1)}`
        }
      </p>
      <br />
      <p>
        {
          formatShiftStaffList(props.staffing)
        }
      </p>
    </Card>
  )
}