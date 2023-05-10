import { Button } from "../components/atoms/button";
import { api } from "../utils/api";
import { NavigationBar } from "../components/elements/navigation-bar";

const Admin = () => {
  const { mutateAsync: generateSchedule } = api.schedule.generate.useMutation({
    onSuccess: () => {
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error);
      });
    }
  });
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery();
  const context = api.useContext();

  const { mutate: removeStaffings } = api.staffing.removeAllStaffing.useMutation({
    onSuccess: () => {
      context.staffing.getStaffing.invalidate({ from: new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0)) }).catch((error) => {
        console.error(error);
      });
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error);
      });
    }
  });

  if (unfulfilledShifts.isLoading) {
    return <div>loading...</div>;
  }

  if (unfulfilledShifts.error) {
    return <div>{unfulfilledShifts.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex mt-4 space-x-4 justify-center">
        <Button color="success" onPress={() => { void generateSchedule() }} className="w-full">Genereer Rooster</Button>
        <Button color="error" onPress={() => { void removeStaffings() }} className="w-full">Verwijder Rooster</Button>
      </div>
      <div className="flex-col m-4 space-y-4 justify-center">
        <Button className="w-full">Handmatige aanpassingen</Button>
        <Button className="w-full">Vrijwilligers beheren</Button>
        <Button className="w-full">Uitbreiden taken</Button>
        <Button className="w-full">Accounts beheren</Button>
      </div>
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
      <NavigationBar />
    </div>
  );
};

export default Admin;
