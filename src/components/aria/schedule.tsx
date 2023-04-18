import React from 'react';
import { StaffingCard } from "../../components/overview-components/staffing-card";
import { api } from '../../utils/api';
import { StaffingWithColleagues } from '../../types/StaffingWithColleagues';


interface ScheduleProps {
  selectedDate: Date;
  weekStart: Date;
}

export const Schedule = ({selectedDate, weekStart}: ScheduleProps) => {
  const staffings = api.staffing.getStaffing.useQuery({from: weekStart});

  if (staffings.isLoading) {
    return <div>loading...</div>;
  }

  if (staffings.error) {
    return <div>{staffings.error.message}</div>;
  }

  return (
    <div className='overflow-y-auto h-[70vh]'>
      {
        staffings.data?.map((get: StaffingWithColleagues) => {
          const date = new Date(get.shift.start);
          date.setHours(0, 0, 0, 0);
          if (date.getTime() === selectedDate.getTime()) {
            return (<StaffingCard staffing={get} />)
          }
        })
      }
    </div>
  );

};