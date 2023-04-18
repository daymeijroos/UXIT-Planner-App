import React from 'react';
import { StaffingCard } from "../../components/overview-components/staffing-card";
import { api } from '../../utils/api';
import { StaffingWithColleagues } from '../../types/StaffingWithColleagues';
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface ScheduleProps {
  selectedDate: Date;
  weekStart: Date;
}

export const Schedule = ({selectedDate, weekStart}: ScheduleProps) => {

  const [parent, enableAnimations] = useAutoAnimate({
    duration: 150,
  })

  const staffings = api.staffing.getStaffing.useQuery({from: weekStart});

  if (staffings.isLoading) {
    return <div>loading...</div>;
  }

  if (staffings.error) {
    return <div>{staffings.error.message}</div>;
  }

  return (
    <div ref={parent} className='overflow-y-auto h-[70vh]'>
    {
      staffings.data?.filter((get: StaffingWithColleagues) => {
        const date = new Date(get.shift.start);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === selectedDate.getTime();
      }).length === 0 ? (
        <p className='text-center m-4'>Er zijn geen vrijwilligers ingepland op deze datum.</p>
      ) : (
        staffings.data?.map((get: StaffingWithColleagues) => {
          const date = new Date(get.shift.start);
          date.setHours(0, 0, 0, 0);
          if (date.getTime() === selectedDate.getTime()) {
            return (<StaffingCard staffing={get} />)
          }
        })
      )
    }
    </div>
  );

};