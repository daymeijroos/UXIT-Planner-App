import React, { useEffect, useState } from 'react'
import { StaffingCard } from "./staffing-card"
import { api } from '../../../utils/api'
import type { StaffingWithColleagues } from '../../../types/StaffingWithColleagues'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { LoadingMessage } from "../generic"
import { WeekView } from "./week-switcher"
import { type CalendarDate, getLocalTimeZone, parseDate } from "@internationalized/date"

export const TeamStaffingList = () => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(parseDate(new Date(new Date().setHours(2, 0, 0, 0)).toISOString().slice(0, 10)))
  const context = api.useContext()

  const staffings = api.staffing.getStaffing.useQuery({ fromDate: selectedDate.toDate(getLocalTimeZone()) })

  useEffect(() => {
    setSelectedDate(parseDate(new Date(new Date().setHours(2, 0, 0, 0)).toISOString().slice(0, 10)))
  }, [])

  const [parent] = useAutoAnimate({
    duration: 150,
  })


  if (staffings.error) {
    return <div>{staffings.error.message}</div>
  }

  let uniqueStaffings
  let sortedStaffings
  let filteredStaffings: StaffingWithColleagues[] = []

  if (!staffings.isLoading) {
    uniqueStaffings = staffings.data.reduce((accumulator: StaffingWithColleagues[], current: StaffingWithColleagues) => {
      const existingStaffing = accumulator.find((staffing: StaffingWithColleagues) => {
        const sameStart = staffing.shift.start.getTime() === current.shift.start.getTime()
        const sameEnd = staffing.shift.end.getTime() === current.shift.end.getTime()
        return sameStart && sameEnd
      })
      if (!existingStaffing) {
        accumulator.push(current)
      }
      return accumulator
    }, [])

    sortedStaffings = uniqueStaffings.sort((a: StaffingWithColleagues, b: StaffingWithColleagues) => {
      const dateA = new Date(a.shift.start)
      const dateB = new Date(b.shift.start)
      return dateA.getTime() - dateB.getTime()
    })

    filteredStaffings = sortedStaffings.filter((get: StaffingWithColleagues) => {
      const date = new Date(get.shift.start)
      date.setHours(0, 0, 0, 0)
      return date.getTime() === selectedDate.toDate(getLocalTimeZone()).getTime()
    })

  }

  return (
    <div ref={parent} className='flex flex-col gap-4 dark:text-white'>
      <WeekView value={selectedDate} onChange={setSelectedDate} onNextWeek={() => {
        context.staffing.getStaffing.invalidate().catch((error) => {
          console.error(error)
        })
      }} onPrevWeek={() => {
        context.staffing.getStaffing.invalidate().catch((error) => {
          console.error(error)
        })
      }} />
      {
        staffings.isLoading ? (
          <LoadingMessage />
        ) :
          filteredStaffings.length === 0 ? (
            <p className='m-4 text-center'>Er zijn geen vrijwilligers ingepland op deze datum.</p>
          ) : (
            filteredStaffings.map((get: StaffingWithColleagues) => {
              const date = new Date(get.shift.start)
              date.setHours(0, 0, 0, 0)
              if (date.getTime() === selectedDate.toDate(getLocalTimeZone()).getTime()) {
                return <StaffingCard staffing={get} key={get.shift_id} />
              }
            })
          )
      }
    </div>
  )

}
