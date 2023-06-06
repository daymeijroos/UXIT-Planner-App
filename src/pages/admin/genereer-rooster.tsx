import { useState } from "react"
import { Button, RangeCalendar, ToastService } from "../../components"
import { api } from "../../utils/api"
import { CalendarDate } from '@internationalized/date'
import { DateValue } from "react-aria"

export default function GenereerRooster() {
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
      <h1>Genereer Rooster</h1>
      <RangeCalendar
        aria-label="Kies een periode om een rooster te genereren."
        value={range}
        onChange={setRange}
      />
      <div className="grid w-full grid-cols-2 gap-4">
        <Button color="teal" onPress={() => {
          if (range) {
            generateSchedule({
              from: range?.start.toDate("Europe/Amsterdam"),
              to: range?.end.toDate("Europe/Amsterdam")
            })
          } else {
            ToastService.info("Kies een periode om een rooster te genereren.")
          }
        }
        }>Genereer Rooster</Button>
      </div>
    </>
  )
}