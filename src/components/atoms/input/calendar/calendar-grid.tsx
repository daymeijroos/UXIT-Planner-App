import { AriaCalendarGridProps, useCalendarGrid, useLocale } from 'react-aria'
import { getWeeksInMonth } from '@internationalized/date'
import { CalendarCell } from './calender-cell'
import { RangeCalendarState } from 'react-stately'

export function CalendarGrid({ state, ...props }: { state: RangeCalendarState }) {
  let { locale } = useLocale()
  let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)
  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps}>
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