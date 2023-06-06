import { useRef } from "react"
import { useCalendarCell } from "@react-aria/calendar"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import type { CalendarState } from "@react-stately/calendar"
import type { CalendarDate } from "@internationalized/date"
import classNames from "classnames"
import type { RangeCalendarState } from "react-stately"
import React from 'react'
import { isSameDay } from "@internationalized/date"

export function CalendarCell(props: { date: CalendarDate, state: CalendarState | RangeCalendarState, range?: boolean }) {
  const ref = useRef(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell(props, props.state, ref)

  const { focusProps, isFocusVisible } = useFocusRing()


  let isSelectionStart = false
  let isSelectionEnd = false
  let isRoundedLeft = false
  let isRoundedRight = false
  let isInRange = false
  if (props.range) {
    const state = props.state as RangeCalendarState
    if (state.highlightedRange) {
      isSelectionStart = state.highlightedRange
        ? isSameDay(props.date, state.highlightedRange.start)
        : isSelected
      isSelectionEnd = state.highlightedRange
        ? isSameDay(props.date, state.highlightedRange.end)
        : isSelected
      isRoundedLeft = isSelectionStart
      isRoundedRight = isSelectionEnd
      isInRange = props.date.compare(state.highlightedRange.start) >= 0 && props.date.compare(state.highlightedRange.end) <= 0
    }
  }

  return (
    <td {...cellProps}>
      <div className={classNames(" w-full h-full", {
        "rounded-l-full": isRoundedLeft,
        "rounded-r-full": isRoundedRight,
        "bg-blue-gray-300 dark:bg-blue-gray-500": isInRange,
      })}>
        <span
          {...buttonProps}
          ref={ref}
          hidden={isOutsideVisibleRange}
          className={classNames("relative flex items-center justify-center cursor-default h-12 w-12 rounded-full outline-none", {
            "hover:bg-teal-600 hover:text-black": !(isDisabled || isUnavailable || isSelectionStart || isSelectionEnd),
            "border-black": isSelected,
            "bg-teal-500 border-2 dark:border-teal-600 text-black": (props.range ? isSelectionStart || isSelectionEnd : isSelected),
            "outline-yellow-500": isFocusVisible,
            "text-gray-600": isDisabled,
            "text-blue-gray-300": isDisabled && isInRange,
            "text-gray-400": isUnavailable,
          })}
          {...mergeProps(buttonProps, focusProps)}
        >
          {formattedDate}
        </span>
      </div>
    </td >
  )
}