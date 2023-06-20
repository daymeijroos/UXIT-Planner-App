import React, { useState } from "react"
import { Item } from "react-stately"
import { Select } from "../../components/atoms/input/Selector"
import { Button, NavigationBar } from "../../components"
import { api } from "../../utils/api"
import { DateRangePicker } from "../../components/atoms/input/calendar/date-range-picker"
import type { DateValue } from "react-aria"
import type { User } from "@prisma/client"

export default function Absence() {
  const users = api.user.getAll.useQuery()

  const [dateValue, setDateValue] = useState<{
    start: DateValue
    end: DateValue
  }>()

  const [userValue, setUserValue] = useState<User>()

  if (users.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={"text-center pt-10 h-screen flex justify-center mx-auto"}>
        <div>
          <h1>Absentie Verwerken</h1>

          <div className={"mt-5"}>
            <Select label="Medewerker / Vrijwilliger" items={users.data} onSelectionChange={(item) => {
              setUserValue(users.data?.find((u) => u.id === item))
            }}>
              {(item) => <Item key={item.id}>{item.name}</Item>}
            </Select>
          </div>
          <div className={"mt-5"}>
            <span className={"flex text-left w-full"}>Kies een datum tussen</span>
            <DateRangePicker
              value={dateValue}
              onChange={(v) => { setDateValue(v) }} />
          </div>
          <div className={"pt-5"}>
            <Button color={"teal"} isDisabled={!(dateValue && userValue)}>Verwerk Absentie</Button>
          </div>
        </div>
      </div>
      <NavigationBar />
    </>
  )
}
