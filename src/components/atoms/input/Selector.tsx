import * as React from "react";
import type { AriaSelectProps } from "@react-types/select";
import { useSelectState } from "react-stately";
import { ChevronDown, ChevronUp } from 'react-feather'

import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing
} from "react-aria";

import { ListBox } from "./ListBox";
import { Popover } from "./popover";

export { Item } from "react-stately";



export function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  const state = useSelectState(props);

  // Get props for child elements from useSelect
  const ref = React.useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className="flex-col w-full mt-4">
      <div
        {...labelProps}
        className="block text-sm font-medium text-gray-700 dark:text-white text-left cursor-default mb-1"
      >
        {props.label}
      </div>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={`p-4 w-full relative inline-flex flex-row items-center justify-between overflow-hidden cursor-default shadow-sm border-r-2 border-l-2 border-t-2 border-b-4 outline-none ${
          isFocusVisible ? "dark:border-gray-400 border-black ring-4 ring-yellow-500" : "dark:border-gray-400 border-black"
        } ${state.isOpen ? "bg-gray-100 dark:bg-gray-600" : "dark:bg-gray-700 bg-white"}`}
      >
        <span
          {...valueProps}
          className={`text-md ${
            state.selectedItem ? "dark:text-white text-black" : "dark:text-gray-400 text-gray-600"
          }`}
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : "Kies een medewerker/Vrijwilliger"}
        </span>
        <>
          {!state.isOpen && (
            <ChevronDown
              className={`w-5 h-5 ${isFocusVisible ? "dark:text-white text-black" : "dark:text-white text-black"}`}
            />
          )}
        </>

        <>
          {state.isOpen && (
            <ChevronUp
              className={`w-5 h-5 ${isFocusVisible ? "dark:text-white text-black" : "dark:text-white text-black"}`}
            />
          )}
        </>

      </button>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={ref}
          placement="bottom start"
          className="w-72"
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}


// Template:
// <Select label="Favorite Animals">
//   <Item key="red panda">Red Panda</Item>
//   <Item key="cat">Cat</Item>
//   <Item key="dog">Dog</Item>
//   <Item key="aardvark">Aardvark</Item>
//   <Item key="kangaroo">Kangaroo</Item>
//   <Item key="snake">Snake</Item>
// </Select>
