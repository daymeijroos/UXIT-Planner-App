import { StaffingWithColleagues } from "../../../types/StaffingWithColleagues";
import { api } from "../../../utils/api";
import { formatDate } from "../../../utils/date/formatDate";
import { formatTime } from "../../../utils/date/formatTime";
import { formatShiftStaffList } from "../../../utils/formatShiftStaffList";
import AddRequiredStaffing from "../../atoms/AddRequiredStaffing";

interface StaffingCardProps {
  staffing: StaffingWithColleagues
}

const cardStyle = `border-2 border-black py-4 px-4 m-4 text-black bg-white`;

export function StaffingCard(props: StaffingCardProps) {
  // const shift_type_id = api.requiredStaffing.getReserveShiftType.useQuery();
  return (
    <div className={cardStyle}>

      {/* Button to test adding required standby-staffing to shift */}
      {/* <AddRequiredStaffing RequiredStaffingProps={{
        shift_id: props.staffing.shift_id,
        amountOfStaffRequired: 1,
        shift_type_id: shift_type_id.data?.id ?? ''
      }}      
      /> */}
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
    </div>
  );
}