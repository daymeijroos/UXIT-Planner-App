import { Button } from "../components/atoms/button";
import { api } from "../utils/api";
import { useRouter } from "next/router";

import { CornerUpLeft } from "react-feather";

const Admin = () => {
  const router = useRouter();

  const { mutateAsync: generateSchedule } = api.schedule.generate.useMutation({
    onSuccess: () => {
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error);
      });
    }
  });
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery();
  const context = api.useContext();

  if (unfulfilledShifts.isLoading) {
    return <div>loading...</div>;
  }

  if (unfulfilledShifts.error) {
    return <div>{unfulfilledShifts.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex m-4 space-x-4">
        <Button onPress={() => { void router.push("/") }} title="Terug" aria-label="Terug"><CornerUpLeft /></Button>
        <Button color="success" onPress={() => { void generateSchedule() }} className="w-max">Genereer Rooster</Button>
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

export default Admin;
