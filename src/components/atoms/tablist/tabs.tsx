import { type ReactElement, useRef } from "react";
import { AriaTabListProps } from "react-aria";
import { useTabList } from 'react-aria';
import { useTabListState } from 'react-stately';
import { TabPanel } from "./tab-panel";
import { Tab } from "./tab";

export function Tabs<T extends object>(props: AriaTabListProps<T>) {
  const state = useTabListState(props);
  const ref = useRef(null);
  const { tabListProps } = useTabList(props, state, ref);
  return (
    <div className={`tabs ${props.orientation || ''} flex flex-col gap-4`}>
      <div {...tabListProps} ref={ref} className="flex justify-center border border-black text-center">
        {[...state.collection].map((item) => (
          <Tab
            key={item.key}
            item={item}
            state={state}
            orientation={props.orientation}
          />
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}