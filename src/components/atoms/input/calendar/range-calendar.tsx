import { type DateValue, type RangeCalendarProps, useLocale, useRangeCalendar } from 'react-aria'
import { useRangeCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import React from 'react'
import { ButtonRound } from '../button'
import { CalendarGrid } from './calendar-grid'

export function RangeCalendar<T extends DateValue>(props: RangeCalendarProps<T>) {
  const { locale } = useLocale()
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar
  })

  const ref = React.useRef(null)
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref)

  return (
    <div {...calendarProps} ref={ref}>
      <div className="flex justify-between">
        <h2>{title}</h2>
        <div className="flex gap-4">
          <ButtonRound {...prevButtonProps}>&lt;</ButtonRound>
          <ButtonRound {...nextButtonProps}>&gt;</ButtonRound>
        </div>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}