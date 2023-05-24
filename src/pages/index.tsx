import { NavigationBar } from "../components/elements/navigation-bar";
import { DateSwitcher } from "../components/elements/schedule/date-switcher";
import { Schedule } from "../components/elements/schedule/schedule";
import { useEffect, useState } from "react";


const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  useEffect(() => {
    setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)))
  }, [])

  if (!selectedDate) return (
    <div>Loading...</div>
  )

  return (
    <div className="dark:bg-[#2B303C] dark:text-white">
      <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Schedule selectedDate={selectedDate} weekStart={weekStart}  />
      <NavigationBar />
    </div>
  );
};

export default Index;
