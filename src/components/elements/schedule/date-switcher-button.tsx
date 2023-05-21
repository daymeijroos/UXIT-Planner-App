import React, { useEffect, useState } from "react";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import type { AriaButtonProps } from "@react-types/button";

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
  0: "Zo"
}

export const DateSwitcherButton = (props: NavigationButtonProps) => {
  const ref = React.useRef(null);
  const { buttonProps, isPressed } = useButton(props, ref)
  const { isFocusVisible, focusProps } = useFocusRing(props);

  const [label, setLabel] = useState<string>(week[props.date.getDay()]);
  const [date, setDate] = useState<number>(props.date.getDate());
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setLabel(week[props.date.getDay()]);
    setDate(props.date.getDate());
    setIsSelected (props.selectedDate.getTime() === props.date.getTime());
  }, [props.date, props.selectedDate])

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
