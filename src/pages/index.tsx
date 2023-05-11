import { NavigationBar } from "../components/aria/navigation-bar";
import { DateSwitcher } from "../components/aria/date-switcher";
import { Schedule } from "../components/aria/schedule";
import { Button } from "../components/aria/button";
import { Zap } from "react-feather";
import { useState } from "react";
import { api } from "../utils/api";
import Toast from "../components/aria/toast";
import { myFunction } from '../components/aria/toast';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)));
  const weekStart = new Date(new Date("2023-04-18T00:00:00Z").setHours(0, 0, 0, 0));

  myFunction("");

  const context = api.useContext();
  const { mutate: generateSchedule } = api.schedule.generate.useMutation({onSuccess: () => {
    context.staffing.getStaffing.invalidate({from: weekStart}).catch((error) => {
      console.error(error);
    });
    context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
      console.error(error);
    });
  }
});

  return (
    <div>
      <Button color="success" fillWidth onPress={() => {generateSchedule();}}>
        <b>Genereer rooster</b><Zap className="ml-2"/>
      </Button>
      <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <Schedule selectedDate={selectedDate} weekStart={weekStart}/>
      {/*<Toast title={"error"} msg={"The quick brown fox jumps over the lazy dog."} type={2} seconds={7500}/>*/}
      {/*<Toast title={"Sucess"} msg={"Het is gelukt!"} type={1} seconds={5000}/>*/}
      {/*<Toast title={"Informatie"} msg={"Wist je dat we via telefoonnummer bereikbaar zijn!"} type={0} seconds={2500}/>*/}
      <NavigationBar/>
    </div>
  );
};

export default Index;
