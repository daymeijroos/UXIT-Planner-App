import React, { useEffect, useState } from 'react'
import { StaffingCard } from "./staffing-card"
import { api } from '../../../utils/api'
import type { StaffingWithColleagues } from '../../../types/StaffingWithColleagues'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { LoadingMessage } from "../generic"
import { WeekView } from "./week-switcher";
import { CalendarDate, getLocalTimeZone, parseDate } from "@internationalized/date";

export const TeamStaffingList = () => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>();
  const weekStart = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))

  const staffings = api.staffing.getStaffing.useQuery({ fromDate: weekStart })

  useEffect(() => {
    setSelectedDate(parseDate(new Date(new Date().setHours(2, 0, 0, 0)).toISOString().slice(0, 10)));
  }, [])

  const [parent] = useAutoAnimate({
    duration: 150,
  })

  if (staffings.isLoading || !selectedDate) return (
    <LoadingMessage />
  )

  if (staffings.error) {
    return <div>{staffings.error.message}</div>
  }

  const uniqueStaffings = staffings.data?.reduce((accumulator: StaffingWithColleagues[], current: StaffingWithColleagues) => {
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

  const sortedStaffings = uniqueStaffings.sort((a: StaffingWithColleagues, b: StaffingWithColleagues) => {
    const dateA = new Date(a.shift.start)
    const dateB = new Date(b.shift.start)
    return dateA.getTime() - dateB.getTime()
  })

  const filteredStaffings = sortedStaffings.filter((get: StaffingWithColleagues) => {
    const date = new Date(get.shift.start)
    date.setHours(0, 0, 0, 0)
    return date.getTime() === selectedDate.toDate(getLocalTimeZone()).getTime()
  })


  return (
    <div ref={parent} className='flex flex-col gap-4 overflow-y-auto dark:text-white'>
      <h1>Team overzicht</h1>
      <WeekView value={selectedDate} onChange={setSelectedDate}/>
      {
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
