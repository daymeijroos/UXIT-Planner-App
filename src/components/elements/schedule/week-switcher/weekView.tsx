import { useCalendarState } from "@react-stately/calendar"
import { useCalendar, useCalendarGrid } from "@react-aria/calendar"
import { useLocale, useDateFormatter } from "@react-aria/i18n"
import type { CalendarDate, DateValue } from "@internationalized/date"
import { createCalendar } from "@internationalized/date"
import { CalendarCell } from "./calenderCell"
import type { AriaCalendarGridProps, AriaCalendarProps } from "react-aria"
import { ChevronLeft, ChevronRight } from "react-feather"
import { ButtonRound } from "../../../atoms"

export function WeekView<T extends DateValue>(props: AriaCalendarProps<T> & AriaCalendarGridProps) {
  const { locale } = useLocale()
  const state = useCalendarState({
    ...props,
    visibleDuration: { weeks: 1 },
    locale,
    createCalendar
  })
  const { prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  )
  const { gridProps } = useCalendarGrid(props, state)

  const startDate = state.visibleRange.start

  const dateFormatter = useDateFormatter({
    dateStyle: "long",
    calendar: startDate.calendar.identifier
  })

  const weekdays = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]

  function nextWeek() {
    state.selectDate(state.value.add({ weeks: 1 }))
  }

  function prevWeek() {
    state.selectDate(state.value.subtract({ weeks: 1 }))
  }

  return (
    <div className="flex justify-center">
      <div className="relative bottom-3 inline-grid grid-cols-[auto,1fr,auto] items-center text-center">
        <h3 className="col-span-3 p-2">
          {dateFormatter.formatRange(
            state.visibleRange.start.toDate(state.timeZone),
            state.visibleRange.end.toDate(state.timeZone)
          )}
        </h3>
        <div className="flex items-center justify-center rounded-full outline-none hover:bg-green-200 active:bg-green-500">
          <ButtonRound
            {...prevButtonProps} onPress={(e) => {
              prevWeek()
              if (prevButtonProps.onPress) prevButtonProps.onPress(e)
            }}>
            <ChevronLeft />
          </ButtonRound>
        </div>
        <table {...gridProps} className="mb-5">
          <thead>
            <tr>
              {weekdays.map((weekday, dayOfWeek) => (
                <th key={dayOfWeek} scope="col">
                  {weekday}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr lang={locale}>
              {state
                .getDatesInWeek(0)
                .map((date: CalendarDate | null, i: number) =>
                  date ? (
                    <CalendarCell key={i} state={state} date={date} />
                  ) : (
                    <td key={i} />
                  )
                )}
            </tr>
          </tbody>
        </table>
        <div className="flex items-center justify-center rounded-full outline-none hover:bg-green-200 active:bg-green-500">
          <ButtonRound
            {...nextButtonProps} onPress={(e) => {
              nextWeek()
              if (nextButtonProps.onPress) nextButtonProps.onPress(e)
            }}>
            <ChevronRight />
          </ButtonRound>
        </div>
      </div>
    </div>
  )
}
