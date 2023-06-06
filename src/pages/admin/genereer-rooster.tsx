import { useState } from "react"
import { Button, NavigationBar, RangeCalendar, ToastService } from "../../components"
import { api } from "../../utils/api"
import { DateValue } from "react-aria"
import React from 'react'
import { useRouter } from "next/router"

export default function GenereerRooster() {
  const router = useRouter()
  let [range, setRange] = useState<{
    start: DateValue,
    end: DateValue
  } | undefined>()

  const context = api.useContext()
  const { mutateAsync: generateSchedule } = api.schedule.generate.useMutation({
    onSuccess: () => {
      ToastService.success("Het is gelukt!")
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error)
      })
      context.staffing.getStaffing.invalidate().catch((error) => {
        console.error(error)
      })
      context.staffing.getPersonalStaffing.invalidate().catch((error) => {
        console.error(error)
      })
    },
    onError: (error) => {
      ToastService.error(error.message)
    },
  })

  return (
    <>
      <div className="flex justify-center max-h-screen pb-24">
        <div className="flex flex-col gap-8 pt-8 text-center">
          <h1>Genereer Rooster</h1>
          <RangeCalendar
            aria-label="Kies een periode om een rooster te genereren."
            value={range}
            onChange={setRange}
          />
          <Button color="teal" onPress={() => {
            if (range) {
              generateSchedule({
                from: range?.start.toDate("Europe/Amsterdam"),
                to: range?.end.toDate("Europe/Amsterdam")
              }).then(() => {
                router.push("/admin")
              })
            } else {
              ToastService.info("Kies een periode om een rooster te genereren.")
            }
          }
          }>Genereer Rooster</Button>
        </div>
      </div>
      <NavigationBar />
    </>
  )
}