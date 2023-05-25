import { NavigationBar } from "../components/elements/navigation-bar";
import { Schedule } from "../../server/api/schedule/schedule.ts";
import { useEffect, useState } from "react";
import { WeekView } from "../components/elements/schedule/weekView";
import { CalendarDate, parseDate, toCalendarDate } from "@internationalized/date";


const Index = () => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>();

  useEffect(() => {
    setSelectedDate(parseDate(new Date(new Date().setHours(2, 0, 0, 0)).toISOString().slice(0, 10)));
  }, [])

  if (!selectedDate) return (
    <div>Loading...</div>
  )

  return (
    <div>
      <WeekView value={selectedDate} onChange={setSelectedDate} />
      <Schedule selectedDate={toCalendarDate(selectedDate)} />
      <NavigationBar />
    </div>
  );
};

export default Index;
