//Create a page with a button in the middle that uses trpc to call the schedule.generate mutation
import { useEffect, useState } from "react";
import { Button } from "../components/aria/button";
import { api } from "../utils/api";
import { useRouter } from "next/router";

import { CornerUpLeft  } from "react-feather";

export default () => {
  const { mutate: generateSchedule } = api.schedule.generate.useMutation({onSuccess: () => {
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
      console.error(error);
    });
  }});
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery();


  const context = api.useContext();

  const handleGenerate = () => {
    const res = generateSchedule();
  };

  if (unfulfilledShifts.isLoading) {
    return <div>loading...</div>;
  }

  if (unfulfilledShifts.error) {
    return <div>{unfulfilledShifts.error.message}</div>;
  }

  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className= "flex m-4 space-x-4">
        <Button onPress={() => {router.push("/")}}><CornerUpLeft/></Button>
        <Button color="success" onPress={handleGenerate} className="w-max">Generate Schedule</Button>
      </div>
      <p>
        {unfulfilledShifts.data?.length} unfulfilled shifts
        total staff required {unfulfilledShifts.data?.reduce((acc, curr) => acc + curr!.amount_required, 0)}
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