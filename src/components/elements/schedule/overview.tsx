import { Item } from "react-stately"
import { TeamStaffingList, PersonalStaffingList } from "."
import { Tabs } from "../../atoms"

export const Overview = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <Tabs>
          <Item key="1" title="Team">
            <TeamStaffingList />
          </Item>
          <Item key="2" title="Persoonlijk">
            <PersonalStaffingList />
          </Item>
        </Tabs>
      </div>
    </div>
  )
}
