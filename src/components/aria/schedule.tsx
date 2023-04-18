import React from 'react';
import { StaffingCard } from "../../components/overview-components/staffing-card";
import { api } from '../../utils/api';
import { StaffingWithColleagues } from '../../types/StaffingWithColleagues';


const schedule = () => {
  const staffings = api.staffing.getStaffing.useQuery();

  if (staffings.isLoading) {
    return <div>loading...</div>;
  }

  if (staffings.error) {
    return <div>{staffings.error.message}</div>;
  }

  return (
    <div className='overflow-y-auto h-[70vh]'>
      {
        staffings.data?.map((get: StaffingWithColleagues) => (
          <StaffingCard staffing={get} />
        ))
      }
    </div>
  );

};

export default schedule;