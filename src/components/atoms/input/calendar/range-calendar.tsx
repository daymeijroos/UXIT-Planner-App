import { DateValue, RangeCalendarProps, useLocale, useRangeCalendar } from 'react-aria'
import { useRangeCalendarState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import React from 'react'
import { Button, ButtonRound } from '../button'
import { CalendarGrid } from './calendar-grid'

export function RangeCalendar<T extends DateValue>(props: RangeCalendarProps<T>) {
  let { locale } = useLocale()
  let state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar
  })

  let ref = React.useRef(null)
  let { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref)

  return (
    <div {...calendarProps} ref={ref}>
      <div className="flex">
        <h2>{title}</h2>
        <ButtonRound {...prevButtonProps}>&lt;</ButtonRound>
        <ButtonRound {...nextButtonProps}>&gt;</ButtonRound>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}