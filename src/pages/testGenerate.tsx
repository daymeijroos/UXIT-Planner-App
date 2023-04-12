//Create a page with a button in the middle that uses trpc to call the schedule.generate mutation
import { useEffect, useState } from "react";
import { Button } from "../components/aria/button";
import { api } from "../utils/api";


export default () => {
  const { mutate: generateSchedule } = api.schedule.generate.useMutation({onSuccess: () => {
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
      console.error(error);
    });
  }});
  const { mutateAsync: testSchedule } = api.schedule.test.useMutation();
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery();


  const context = api.useContext();

  const handleGenerate = () => {
    const res = generateSchedule();
  };

  const handleTest = async () => {
    const res = await testSchedule();
  };

  if (unfulfilledShifts.isLoading) {
    return <div>loading...</div>;
  }

  if (unfulfilledShifts.error) {
    return <div>{unfulfilledShifts.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Button onPress={handleGenerate}>Generate Schedule</Button>
      <Button onPress={handleTest}>Test Schedule</Button>
      <p>
        {unfulfilledShifts.data?.length} unfulfilled shifts
      </p>
      {unfulfilledShifts.data?.map((request) => {
        const requestResolved = request
        return (
          <div key={requestResolved?.shift_id}>
            <p>Shift ID: {requestResolved?.shift_id}</p>
            <p>Shift type: {requestResolved?.shift_type_id}</p>
            <p>Amount required: {requestResolved?.amount_required}</p>
            <p>Amount staffed: {requestResolved?.amount_staffed}</p>
          </div>
        );
      })}
    </div>
  );
};