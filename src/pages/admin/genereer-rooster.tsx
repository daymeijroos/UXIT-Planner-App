import { useState } from "react"
import { Button, NavigationBar, RangeCalendar, ToastService } from "../../components"
import { api } from "../../utils/api"
import type { DateValue } from "react-aria"
import React from 'react'
import { useRouter } from "next/router"

export default function GenereerRooster() {
  const router = useRouter()
  const [range, setRange] = useState<{
    start: DateValue,
    end: DateValue
  } | undefined>()

  const context = api.useContext()
  const { mutate: generateSchedule, isLoading } = api.schedule.generate.useMutation({
    onSuccess: () => {
      ToastService.success("Het is gelukt!")
      context.schedule.getUnfulfilledShifts.invalidate().catch(() => {
        ToastService.error("Er is iets misgegaan bij het ophalen van de onvervulde diensten")
      })
      context.staffing.getStaffing.invalidate().catch(() => {
        ToastService.error("Er is iets misgegaan bij het ophalen van de planning")
      })
      context.staffing.getPersonalStaffing.invalidate().catch(() => {
        ToastService.error("Er is iets misgegaan bij het ophalen van de persoonlijke planning")
      })
      router.push("/").catch(() => {
        ToastService.error("Er is iets misgegaan bij het openen van de planning")
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
          <Button color="teal" isDisabled={isLoading} onPress={() => {
            if (range) {
              generateSchedule({
                from: range?.start.toDate("Europe/Amsterdam"),
                to: range?.end.add({ days: 1 }).toDate("Europe/Amsterdam")
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
