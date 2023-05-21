import { useEffect, useState } from "react";
import { Schedule } from "./schedule";
import { DateSwitcher } from "./date-switcher";
import { Tabs } from "../../atoms/tablist/tabs";
import { Item } from "react-stately";

export const Overview = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  useEffect(() => {
    setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)))
  }, [])

  if (!selectedDate) return (
    <div>Loading...</div>
  )


  return (
    <div className="m-4">
      <Tabs>
        <Item key="1" title="Team">
          <div className="flex flex-col gap-2">
            <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <Schedule selectedDate={selectedDate} weekStart={weekStart} />
          </div>
        </Item>
        <Item key="2" title="Personal">
          <h1>Personal</h1>
        </Item>
      </Tabs>
    </div>
  )
}