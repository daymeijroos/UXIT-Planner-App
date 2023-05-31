import { StaffingWithColleagues } from "../../../types/StaffingWithColleagues";
import { api } from "../../../utils/api";
import { formatDate } from "../../../utils/date/formatDate";
import { formatTime } from "../../../utils/date/formatTime";
import { formatShiftStaffList } from "../../../utils/formatShiftStaffList";
import { Card } from "../../atoms/card";
import {formatDate} from "../../../utils/date/formatDate";
import {formatShiftStaffList} from "../../../utils/formatShiftStaffList";
import {useState} from "react";
import {Button} from "../../atoms/button";
import {useSession} from "next-auth/react";
import {TextField} from "../../atoms/text-field";


interface StaffingCardProps {
    staffing: StaffingWithColleagues;
}

const cardStyle = 'border-2 border-black py-4 px-4 m-4 text-black bg-white';

export function StaffingCard(props: StaffingCardProps) {
  // const shift_type_id = api.requiredStaffing.getReserveShiftType.useQuery();

    const { data: sessionData, status } = useSession();
    const userName = sessionData?.user?.name;

    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState('');

    const determineShowButton = (staffing: StaffingWithColleagues): boolean => {
        let result = true;
        staffing.shift.staffings.forEach((nestedStaffing) => {
            const staffName = nestedStaffing.user.first_name ?? 'Onbekende naam';

            if (staffName === userName) {
                result = true;
            }
        });

        return result;
    };


    const handleButtonClick = () => {
        setShowForm(true);
    };


    const { mutate: handleFormSubmit } = api.absence.createAbsence.useMutation()

    return (
        <div className={cardStyle + "dark:bg-[#2B303C] dark:text-white dark:border-steel"}>
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
            {determineShowButton(props.staffing)  && !showForm && (
                <Button onPress={handleButtonClick}>Afmelden</Button>
            )}
            {showForm && (<div>
                    <TextField onChange={setReason}/>
                    <Button onPress={() => {handleFormSubmit({ shift_id: props.staffing.shift.id,
                        reason: reason})}}>Submit</Button>
                </div>
            )}
        </div>
    );
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
  );
}
