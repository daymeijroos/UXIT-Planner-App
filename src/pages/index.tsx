import { NavigationBar } from "../components/aria/navigation-bar";
import { DateSwitcher } from "../components/aria/date-switcher";
import { Schedule } from "../components/aria/schedule";
import { Button } from "../components/aria/button";
import { Zap } from "react-feather";
import { useState } from "react";
import { api } from "../utils/api";

const index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)));
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  const context = api.useContext();
  const { mutate: generateSchedule } = api.schedule.generate.useMutation({onSuccess: () => {
    context.staffing.getStaffing.invalidate({from: weekStart}).catch((error) => {
    console.error(error);
  });
}});

  return (
    <div>
      <Button color="success" fillWidth onPress={() => {generateSchedule()}}>
        <b>Genereer rooster</b><Zap className="ml-2"/>
      </Button>
      <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <Schedule selectedDate={selectedDate} weekStart={weekStart}/>
      <NavigationBar/>
    </div>
  );
};

export default index;
