import { useRef } from "react";
import { useCalendarCell } from "@react-aria/calendar";
import { useDateFormatter, useLocale } from "@react-aria/i18n";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { CalendarDate } from "@internationalized/date";

export function CalendarCell(props) {
  const { locale } = useLocale("nl-NL");
  const ref = useRef(null);
  const { cellProps, buttonProps } = useCalendarCell(props, props.state, ref);

  const dateFormatter = useDateFormatter({
    day: "numeric",
    timeZone: props.state.timeZone,
  });

  const isSelected = props.state.isSelected(props.date);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td {...cellProps}>
      <span
        ref={ref}
        className={`${
          isSelected ? "accent-blue-700 bg-teal border-2 border-black" : ""
        }  relative flex items-center justify-center cursor-default h-12 w-12 rounded-full outline-none hover:bg-green-200${
          isFocusVisible ? "shadow-outline-seagreen" : ""
        }`}
        {...mergeProps(buttonProps, focusProps)}
      >
        {dateFormatter.format(props.date.toDate(props.state.timeZone))}
      </span>
    </td>
  );
}
