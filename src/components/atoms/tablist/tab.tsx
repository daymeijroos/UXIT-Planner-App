import { type ReactElement, useRef } from "react";
import { Orientation, useTab } from "react-aria";
import { TabListState } from "react-stately";
import { Node } from "@react-types/shared"

export function Tab<T extends object>({ item, state, orientation }: {
  item: Node<T>;
  state: TabListState<T>;
  orientation?: Orientation;
}) {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { tabProps, isSelected } = useTab({ key }, state, ref);
  return (
    <div {...tabProps} className={`
    ${isSelected ? "bg-teal dark:text-black" : ""}
    hover:bg-dark-teal dark:hover:bg-light-teal dark:active:bg-dark-teal shadow-lg
    p-4 w-full border border-black dark:border-steel text-center
    `} ref={ref}>
      {rendered}
    </div>
  );
}