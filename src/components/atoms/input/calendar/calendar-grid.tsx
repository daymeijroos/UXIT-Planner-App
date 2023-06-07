import { useCalendarGrid, useLocale } from 'react-aria'
import { getWeeksInMonth } from '@internationalized/date'
import { CalendarCell } from './calender-cell'
import type { RangeCalendarState } from 'react-stately'
import React from 'react'

export function CalendarGrid({ state, ...props }: { state: RangeCalendarState }) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} className='border-collapse border-spacing-0'>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => <th key={index}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    range
                  />
                )
                : <td key={i} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}