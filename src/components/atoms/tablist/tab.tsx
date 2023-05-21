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
    ${isSelected ? "bg-teal shadow-lg" : ""}
    hover:bg-dark-teal
    p-4 w-full border border-black text-center
    `} ref={ref}>
      {rendered}
    </div>
  );
}