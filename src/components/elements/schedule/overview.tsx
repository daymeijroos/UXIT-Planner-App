import { useEffect, useState } from "react"
import { Item } from "react-stately"
import { DateSwitcher, TeamStaffingList, PersonalStaffingList } from "."
import { Tabs } from "../../atoms"
import { LoadingMessage } from "../generic/loading-message"

export const Overview = () => {
  return (
    <div className="flex justify-center m-4">
      <div className="w-full max-w-4xl">
        <Tabs>
          <Item key="1" title="Team">
            <TeamStaffingList />
          </Item>
          <Item key="2" title="Personal">
            <PersonalStaffingList />
          </Item>
        </Tabs>
      </div>
    </div>
  )
}