import Datepicker from "react-tailwindcss-datepicker"
import React, { useState } from "react"
import { Item } from "react-stately"
import { Select } from "../../components/atoms/input/Selector"
import { Button } from "../../components"
import { api } from "../../utils/api"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"

export default function Absence() {
  const users = api.user.getAllUsers.useQuery()

  const [value, setValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  })

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue)
  }

  if (users.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={"text-center pt-10 h-screen flex justify-center mx-auto"}>
      <div>
        <h1>Absentie Verwerken</h1>

        <div className={"mt-5"}>
          <Select label="Medewerker / Vrijwilliger" initialText="Medewerker / Vrijwilliger" id="absence" items={users.data}>
            {(item) => <Item>{item.name}</Item>}
          </Select>
        </div>
        <div className={"mt-5"}>
          <span className={"flex text-left w-full"}>Kies een datum tussen</span>
          <Datepicker
            primaryColor={"teal"}
            containerClassName="flex w-full"
            displayFormat={"DD-MM-YYYY"}
            inputClassName="p-4 dark:bg-gray-700 dark:text-white dark:border-gray-500 text-black w-full text-left border-2 border-black border-r-0"
            toggleClassName="pr-4 dark:text-white dark:bg-gray-700 p-2 dark:border-gray-500 border-black border-2 border-l-0"
            showShortcuts={false}
            showFooter={false}
            value={value}
            onChange={handleValueChange}
          />
        </div>
        <div className={"pt-5"}>
          <Button color={"teal"}>Verwerk Absentie</Button>
        </div>
      </div>
    </div>
  )
}
