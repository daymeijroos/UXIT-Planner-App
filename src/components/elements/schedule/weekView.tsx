import styled from "styled-components";
import { useCalendarState } from "@react-stately/calendar";
import { useCalendar, useCalendarGrid } from "@react-aria/calendar";
import { useLocale, useDateFormatter } from "@react-aria/i18n";
import { CalendarDate, createCalendar, parseDate } from "@internationalized/date";
import { Button } from "./button";
import { CalendarCell } from "./calenerCell";
import { AriaCalendarGridProps, AriaCalendarProps } from "react-aria";
import { ChevronLeft, ChevronRight } from "react-feather";

const StyledWeekView = styled.div`
  display: inline-grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

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
  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );
  const { gridProps } = useCalendarGrid(props, state);

  const startDate = state.visibleRange.start;

  const dateFormatter = useDateFormatter({
    dateStyle: "long",
    calendar: startDate.calendar.identifier
  });

  return (
    <StyledWeekView>
      <Title>
        {dateFormatter.formatRange(
          state.visibleRange.start.toDate(state.timeZone),
          state.visibleRange.end.toDate(state.timeZone)
        )}
      </Title>
      <Button {...prevButtonProps}>
        <ChevronLeft style={{ width: 20, height: 20 }} />
      </Button>
      <table {...gridProps}>
        <tbody>
        <tr>
          {state
            .getDatesInWeek(0)
            .map((date: CalendarDate, i: number) =>
              date ? (
                <CalendarCell key={i} state={state} date={date} />
              ) : (
                <td key={i} />
              )
            )}
        </tr>
        </tbody>
      </table>
      <Button {...nextButtonProps}>
        <ChevronRight style={{ width: 20, height: 20 }} />
      </Button>
    </StyledWeekView>
  );
}
