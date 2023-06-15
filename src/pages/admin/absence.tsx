import Datepicker from "react-tailwindcss-datepicker"
import React, { useState } from "react"
import { Item } from "react-stately"
import { Button, ToastService, Select } from "../../components"
import { api } from "../../utils/api"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import { User } from "@prisma/client";
import { useRouter } from "next/router";

export default function Absence() {
  const router = useRouter()
  const users = api.user.getAllUsers.useQuery();
  const { mutate: createAbsence } = api.absence.createAbsence.useMutation(
    {
      onSuccess: () => {
        ToastService.success("De absentie is verwerkt")
        router.push("/").catch((error) => {
          console.error(error)
        })
      },
      onError: (error) => {
        console.log(error);
        ToastService.error(error.message)
      }
    }
  );
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  })

  const [userValue, setUserValue] = useState<User>();



  const handleAbsence = () => {
    if (!userValue) return
    createAbsence({
      startDate: value.startDate,
      endDate: value.endDate,
      userId: userValue?.id
    })
  }


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
          <Select label="Medewerker / Vrijwilliger" items={users.data} onSelectionChange={(item) => {
            setUserValue(users.data?.find((u) => u.id === item))
          }}>
            {(item) => <Item key={item.id}>{item.name}</Item>}
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
          <Button color={"teal"} onPress={() => {handleAbsence()}
          } >Verwerk Absentie</Button>
        </div>
      </div>
    </div>
  )
}
