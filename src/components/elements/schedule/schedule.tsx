import React from 'react';
import { StaffingCard } from "./staffing-card";
import { api } from '../../../utils/api';
import type { StaffingWithColleagues } from '../../../types/StaffingWithColleagues';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { getFirstDayOfTheWeek } from "../../../../shared/date/dateHelperFunctions";

interface ScheduleProps {
  selectedDate: CalendarDate;
}

export const Schedule = ({ selectedDate }: ScheduleProps) => {
  const weekStart = getFirstDayOfTheWeek(selectedDate.toDate(getLocalTimeZone()));

  const [parent] = useAutoAnimate({
    duration: 150,
  })

  const staffings = api.staffing.getStaffing.useQuery({ from: weekStart });

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

  const sortedStaffings = uniqueStaffings.sort((a: StaffingWithColleagues, b: StaffingWithColleagues) => {
    const dateA = new Date(a.shift.start);
    const dateB = new Date(b.shift.start);
    return dateA.getTime() - dateB.getTime();
  });

  const filteredStaffings = sortedStaffings.filter((get: StaffingWithColleagues) => {
    const date = new Date(get.shift.start);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === selectedDate.toDate(getLocalTimeZone()).getTime();
  });


  return (
    <div ref={parent} className='overflow-y-auto h-[70vh]'>
      {
        filteredStaffings.length === 0 ? (
          <p className='text-center m-4'>Er zijn geen vrijwilligers ingepland op deze datum.</p>
        ) : (
          filteredStaffings.map((get: StaffingWithColleagues) => {
            const date = new Date(get.shift.start);
            date.setHours(0, 0, 0, 0);
            if (date.getTime() === selectedDate.toDate(getLocalTimeZone()).getTime()) {
              return <StaffingCard staffing={get} key={get.shift_id} />;
            }
          })
        )
      }
    </div>
  );

};
