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

  const uniqueStaffings = staffings.data?.reduce((accumulator: StaffingWithColleagues[], current: StaffingWithColleagues) => {
    const existingStaffing = accumulator.find((staffing: StaffingWithColleagues) => {
      const sameStart = staffing.shift.start.getTime() === current.shift.start.getTime();
      const sameEnd = staffing.shift.end.getTime() === current.shift.end.getTime();
      return sameStart && sameEnd;
    });
    if (!existingStaffing) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  

  return (
    <div ref={parent} className='overflow-y-auto h-[70vh]'>
    {
      uniqueStaffings.sort((a: StaffingWithColleagues, b: StaffingWithColleagues) => {
          const dateA = new Date(a.shift.start);
          const dateB = new Date(b.shift.start);
          return dateA.getTime() - dateB.getTime();
        })
        .filter((get: StaffingWithColleagues) => {
          const date = new Date(get.shift.start);
          date.setHours(0, 0, 0, 0);
          return date.getTime() === selectedDate.getTime();
        }).length === 0 ? (
        <p className='text-center m-4'>Er zijn geen vrijwilligers ingepland op deze datum.</p>
      ) : (
        uniqueStaffings.map((get: StaffingWithColleagues) => {
          const date = new Date(get.shift.start);
          date.setHours(0, 0, 0, 0);
          if (date.getTime() === selectedDate.getTime()) {
            return <StaffingCard staffing={get} />;
          }
        })
      )
    }
    </div>
  );

};