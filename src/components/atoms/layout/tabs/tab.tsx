import { useRef } from "react"
import { useTab } from "react-aria"
import type { TabListState } from "react-stately"
import type { Node } from "@react-types/shared"

export function Tab<T extends object>({ item, state }: {
  item: Node<T>
  state: TabListState<T>
}) {
  const { key, rendered } = item
  const ref = useRef(null)
  const { tabProps, isSelected } = useTab({ key }, state, ref)
  return (
    <div {...tabProps} className={`
    ${isSelected ? "bg-teal-500dark:text-black" : ""}
    hover:bg-teal-300 dark:hover:bg-light-teal-500dark:active:bg-teal-300 shadow-lg
    p-4 w-full border border-black dark:border-steel text-center
    `} ref={ref}>
      {rendered}
    </div>
  )
}