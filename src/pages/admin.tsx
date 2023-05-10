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
      context.staffing.getStaffing.invalidate({ from: new Date(new Date("2023-04-18T00:00:00Z").setHours(0, 0, 0, 0)) }).catch((error) => {
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
      <h1 className="mt-4 text-3xl font-bold text-center">Admin paneel</h1>
      <h2 className="mt-4 text-xl font-bold text-center">Rooster</h2>
      <div className="sm:flex flex-wrap mt-4 space-x-4 max-sm:space-x-0 justify-center">
        <Button color="success" onPress={() => { void generateSchedule(); }} className="w-64">Genereer Rooster</Button>
        <Button color="error" onPress={() => { void removeStaffings(); }} className="w-64 max-sm:mt-4">Verwijder Rooster</Button>
      </div>
      <div className="sm:flex flex-wrap mt-4 space-x-4 max-sm:space-x-0 justify-center">
        <Button className="w-64">Handmatige aanpassingen</Button>
        <Button className="w-64 max-sm:mt-4">Openingsweekend aangeven</Button>
      </div>
      <div className="sm:flex flex-col items-center m-4 space-y-4 justify-center">
        <h2 className="text-xl font-bold text-center">Vrijwilligers</h2>
        <div className="sm:flex flex-wrap mt-4 space-x-4 max-sm:space-x-0 justify-center">
          <Button className="w-64">Voorkeur aanpassen</Button>
          <Button className="w-64 max-sm:mt-4">Beschikbaarheid aanpassen</Button>
        </div>
        <div className="sm:flex flex-wrap mt-4 space-x-4 max-sm:space-x-0 justify-center">
          <Button className="w-64">Werkuren aanpassen</Button>
          <Button className="w-64 max-sm:mt-4">Verlof aangeven</Button>
        </div>
        <div className="justify-center">
          <Button className="w-64">Inwerken inroosteren</Button>
        </div>
        <h2 className="mt-4 text-xl font-bold text-center">Uitbreiding</h2>
        <div className="justify-center">
          <Button className="w-64">Nieuw shifttype toevoegen</Button>
        </div>
        <h2 className="mt-4 text-xl font-bold text-center">Accounts beheren</h2>
        <div className="sm:flex flex-wrap mt-4 space-x-4 max-sm:space-x-0 justify-center">
          <Button className="w-64">Rollenbeheer</Button>
          <Button className="w-64 max-sm:mt-4 max-sm:mb-20">Account aanmaken</Button>
        </div>
      </div>
  {unfulfilledShifts.data?.map((request) => {
        const requestResolved = request;
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
