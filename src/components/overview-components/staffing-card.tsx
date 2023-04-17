import { Shift, Shift_Type, Staffing } from "@prisma/client";

interface StaffingWithColleagues extends Staffing {
  shift: Shift & {
    staffings: {
      user: {
        id: string,
        first_name: string
      },
      shift_type: Shift_Type
    }[]
  },
  shift_type: Shift_Type,
}

interface StaffingCardProps {
  staffing: StaffingWithColleagues
}

function formatDate(date: Date) {
  const daysOfWeek = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  const monthsOfYear = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthOfYear = monthsOfYear[date.getMonth()];

  return `${dayOfWeek} ${dayOfMonth} ${monthOfYear}`;
}

function formatShiftStaff(staffing: StaffingWithColleagues) {
  const shifts: {[key: string]: string[]} = {};

  staffing.shift.staffings.forEach(nestedStaffing => {
    const shiftTypeName = nestedStaffing.shift_type.name;

    if (!shifts[shiftTypeName]) {
      shifts[shiftTypeName] = [];
    }

    // Check if the current user is the same as the user in the staffing

    const staffName = `${staffing.user_id === nestedStaffing.user.id? "U" : nestedStaffing.user.first_name}`;

    shifts[shiftTypeName].push(staffName);
  });

  const formattedShifts = Object.entries(shifts).map(([shiftTypeName, staffNames]) => {
    const formattedStaffNames = staffNames.join(', ');
    return `${shiftTypeName}: ${formattedStaffNames}`;
  }).join('\n');

  return formattedShifts;
}


const cardStyle = `border-2 border-black py-4 px-4 m-4 text-black bg-white`;

export function StaffingCard(props: StaffingCardProps) {
  return (
    <div className={cardStyle}>
      <h1 className="text-2xl font-bold">
        {
          `${props.staffing.shift.start.getHours()}:${props.staffing.shift.start.getMinutes().toString().padStart(2, '0')}-${props.staffing.shift.end.getHours()}:${props.staffing.shift.end.getMinutes().toString().padStart(2, '0')}`
        }
      </h1>
      <p>
        {
          `${formatDate(props.staffing.shift.start)[0].toUpperCase()}${formatDate(props.staffing.shift.start).slice(1)}`
        }
      </p>
      <br/>
      <p>
        {
          formatShiftStaff(props.staffing).split('\n')
            .map((line, index) => <span key={index}>{line}<br/></span>)
        }
      </p>
    </div>
  );
}