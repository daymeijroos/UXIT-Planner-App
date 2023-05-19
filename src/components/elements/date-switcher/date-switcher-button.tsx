import React, { useEffect } from "react";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { AriaButtonProps } from "@react-types/button";

interface NavigationButtonProps extends AriaButtonProps {
  date: Date;
  selectedDate: Date;
}


const week: { [key: number]: string} = {
  1: "Ma",
  2: "Di",
  3: "Wo",
  4: "Do",
  5: "Vr",
  6: "Za",
  0: "Zo",
}

export const DateSwitcherButton = (props: NavigationButtonProps) => {
  const ref = React.useRef(null);
  const { buttonProps, isPressed } = useButton(props, ref)
  const { isFocusVisible, focusProps } = useFocusRing(props);

  let label = week[props.date.getDay()]
  let date = props.date.getDate();
  let isSelected = props.selectedDate.getTime() === props.date.getTime();

  useEffect(() => {
    label = week[props.date.getDay()]
    date = props.date.getDate();
    isSelected = props.selectedDate.getTime() === props.date.getTime();
  }, [props.date])

  return (
    <div
      className={`${isPressed ? "bg-teal" : "bg-teal"
      } text-black rounded-full h-12 w-12 flex flex-col items-center justify-center focus:outline-none focus:ring-4 ${isFocusVisible ? "ring-blue-300" : ""
      } ${isSelected
        ? "bg-teal border-black border-2"
        : isPressed
          ? "bg-teal"
          : "bg-white"
      }`}
      {...buttonProps}
      {...focusProps}>
      <span className="sr-only">{`${label}: ${date}`}</span>
      <span className="text-lg font-bold">{label}</span>
      <span className="text-sm">{date}</span>
    </div>
  );
};
