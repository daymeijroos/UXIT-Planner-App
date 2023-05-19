import type { StaffingWithColleagues } from "../../types/StaffingWithColleagues";
import { formatDate } from "../../utils/date/formatDate";
import { formatTime } from "../../utils/date/formatTime";
import { formatShiftStaffList } from "../../utils/formatShiftStaffList";
import {Button} from "../atoms/button";
import {api} from "../../utils/api";
import {useSession} from "next-auth/react";


interface StaffingCardProps {
  staffing: StaffingWithColleagues
}

const cardStyle = `border-2 border-black py-4 px-4 m-4 text-black bg-white`;
const showButton = false


export function StaffingCard(props: StaffingCardProps) {
    const { data: sessionData } = useSession();
    const userId = sessionData?.user


  return (
    <div className={cardStyle}>
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
        <div>
            {showButton && <Button>Afmelden</Button>}
        </div>
    </div>
  );
}
