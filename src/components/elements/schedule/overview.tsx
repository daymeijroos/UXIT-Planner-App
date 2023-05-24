import { useEffect, useState } from "react";
import { TeamStaffingList } from "./team-staffing-list";
import { DateSwitcher } from "./date-switcher";
import { Tabs } from "../../atoms/tablist/tabs";
import { Item } from "react-stately";
import { PersonalStaffingList } from "./personal-staffings-list";

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
    <div className="m-4 flex justify-center">
      <div className="max-w-4xl w-full">
        <Tabs>
          <Item key="1" title="Team">
            <div className="flex flex-col gap-2">
              <DateSwitcher selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              <TeamStaffingList selectedDate={selectedDate} weekStart={weekStart} />
            </div>
          </Item>
          <Item key="2" title="Personal">
            <PersonalStaffingList />
          </Item>
        </Tabs>
      </div>
    </div>
  )
}