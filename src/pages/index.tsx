import { NavigationBar } from "../components/elements/navigation-bar";
import { DateSwitcher } from "../components/elements/schedule/date-switcher";
import { Schedule } from "../components/elements/schedule/schedule";
import { useEffect, useState } from "react";
import { WeekView } from "../components/elements/schedule/weekView";
import { CalendarDate, parseDate, toCalendarDateTime } from "@internationalized/date";


const Index = () => {
  const [selectedDate, setSelectedDate] = useState<typeof CalendarDate>(null);
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  useEffect(() => {
    setSelectedDate(parseDate(new Date(new Date().setHours(0, 0, 0, 0)).toISOString().slice(0, 10)))
  }, [])

  if (!selectedDate) return (
    <div>Loading...</div>
  )

  return (
    <div>
      <WeekView value={selectedDate} onChange={setSelectedDate} />
      <Schedule selectedDate={toCalendarDateTime(selectedDate)} weekStart={weekStart} />
      <NavigationBar />
    </div>
  );
};

export default Index;
