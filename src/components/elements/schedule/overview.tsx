import { useEffect, useState } from "react"
import { Item } from "react-stately"
import { DateSwitcher, TeamStaffingList, PersonalStaffingList } from "."
import { Tabs } from "../../atoms"
import { LoadingMessage } from "../generic/loading-message"

export const Overview = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  useEffect(() => {
    setSelectedDate(new Date(new Date().setHours(0, 0, 0, 0)))
  }, [])

  if (!selectedDate) return (
    <LoadingMessage />
  )

  return (
    <div className="flex justify-center m-4">
      <div className="w-full max-w-4xl">
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