import styled from "styled-components";
import { useCalendarState } from "@react-stately/calendar";
import { useCalendar, useCalendarGrid } from "@react-aria/calendar";
import { useLocale, useDateFormatter } from "@react-aria/i18n";
import { CalendarDate, createCalendar } from "@internationalized/date";
import { Button } from "./button";
import { CalendarCell } from "./calenderCell";
import { AriaCalendarGridProps, AriaCalendarProps } from "react-aria";
import { ChevronLeft, ChevronRight } from "react-feather";

const Title = styled.h3`
  grid-area: 1 / span 3;
`;

export function WeekView<T extends object>(props: AriaCalendarProps<T> & AriaCalendarGridProps) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    visibleDuration: { weeks: 1 },
    locale,
    createCalendar
  });
  const { prevButtonProps, nextButtonProps} = useCalendar(
    props,
    state
  );
  const { gridProps } = useCalendarGrid(props, state);

  const startDate = state.visibleRange.start;

  const dateFormatter = useDateFormatter({
    lang: locale,
    dateStyle: "long",
    calendar: startDate.calendar.identifier
  });

  return (
    <div className="flex align-middle justify-center">
      <div className="inline-grid grid-cols-[auto,1fr,auto] items-center text-center mt-5">
        <h3 className="col-span-3">
          {dateFormatter.formatRange(
            state.visibleRange.start.toDate(state.timeZone),
            state.visibleRange.end.toDate(state.timeZone)
          )}
        </h3>
        <Button
          className="rounded-full flex items-center justify-center outline-none hover:bg-green-200 active:bg-green-500"
          {...prevButtonProps}>
          <ChevronLeft/>
        </Button>
        <table {...gridProps}>
          <tbody>
          <tr lang={locale}>
            {state
              .getDatesInWeek(0)
              .map((date: CalendarDate, i: number) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date}/>
                ) : (
                  <td key={i}/>
                )
              )}
          </tr>
          </tbody>
        </table>
        <Button
          className="rounded-full flex items-center justify-center outline-none hover:bg-green-200 active:bg-green-500"
          {...nextButtonProps}>
          <ChevronRight/>
        </Button>
      </div>
    </div>
  );
}
