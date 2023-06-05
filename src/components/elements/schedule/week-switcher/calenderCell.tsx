import { useRef } from "react"
import { useCalendarCell } from "@react-aria/calendar"
import { useDateFormatter } from "@react-aria/i18n"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import type { CalendarState } from "@react-stately/calendar"
import type { CalendarDate } from "@internationalized/date"
import classNames from "classnames"

export function CalendarCell(props: { date: CalendarDate, state: CalendarState }) {
  const ref = useRef(null)
  const { cellProps, buttonProps } = useCalendarCell(props, props.state, ref)

  const dateFormatter = useDateFormatter({
    day: "numeric",
    timeZone: props.state.timeZone,
  })

  const isSelected = props.state.isSelected(props.date)
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <td {...cellProps}>
      <span
        ref={ref}
        className={classNames("relative flex items-center justify-center cursor-default h-12 w-12 rounded-full outline-none hover:bg-teal-600 hover:text-black", {
          "bg-teal-500 border-2 border-black dark:border-teal-600 text-black": isSelected,
          "outline-yellow-500": isFocusVisible
        })}
        {...mergeProps(buttonProps, focusProps)}
      >
        {dateFormatter.format(props.date.toDate(props.state.timeZone))}
      </span>
    </td>
  )
}
