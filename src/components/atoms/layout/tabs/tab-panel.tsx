import { useRef } from "react";
import { useTabPanel } from "react-aria";
import type { TabListState } from "react-stately";

export function TabPanel<T extends object>({ state, ...props }: {
  state: TabListState<T>
}) {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref}>
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        state.selectedItem.props.children
      }
    </div>
  );
}