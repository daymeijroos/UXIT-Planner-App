import { useRef } from "react"
import { useTab } from "react-aria"
import type { TabListState } from "react-stately"
import type { Node } from "@react-types/shared"
import classNames from "classnames"
import React from 'react'

export function Tab<T extends object>({ item, state }: {
  item: Node<T>
  state: TabListState<T>
}) {
  const { key, rendered } = item
  const ref = useRef(null)
  const { tabProps, isSelected } = useTab({ key }, state, ref)
  return (
    <div {...tabProps} className={
      classNames(
        'p-4 w-full border border-black text-center hover:bg-teal-300 dark:active:bg-teal-600 dark:border-blue-gray-600 dark:hover:bg-light-teal-500',
        { 'bg-teal-500 text-black': isSelected }
      )
    } ref={ref}>
      {rendered}
    </div>
  )
}