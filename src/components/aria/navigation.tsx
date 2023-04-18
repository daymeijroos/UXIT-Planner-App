import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import React, { useState } from "react";

const Navigation = () => {
  return (
    <NavigationBar />
  );
};

interface NavigationButtonProps {
  day: string;
  date: string;
  onClick: () => void;
  isSelected: boolean;
}

const NavigationButton = (props: NavigationButtonProps) => {
  const ref = React.useRef(null);
  const { buttonProps, isPressed } = useButton({
    onPress: props.onClick,
  }, ref)
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      className={`${
        isPressed ? "bg-teal" : "bg-teal"
      } text-black rounded-full h-12 w-12 flex flex-col items-center justify-center focus:outline-none focus:ring-4 ${
        isFocusVisible ? "ring-blue-300" : ""
      } ${
        props.isSelected
          ? "bg-teal border-black border-2"
          : isPressed
            ? "bg-teal"
            : "bg-white"
      }`}
      {...buttonProps}
      {...focusProps}>
      <span className="sr-only">{props.day}</span>
      <span className="text-lg font-bold">{props.day.slice(0, 2)}</span>
      <span className="text-sm">{new Date(props.date).getDate()}</span>
    </div>
  );
};

const NavigationBar = () => {
  const [selectedDay, setSelectedDay] = useState<string>("Donderdag");

  const handleClick = (day: string) => {
    setSelectedDay(day);
  }

  return (
    <nav className="bg-white py-2 px-4 rounded-lg flex flex-col space-x-2 justify-center">
      <div className="flex items-center justify-between border-black border-2 my-2">
        <button
          className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none">
          <span className="sr-only">Previous week</span>
          &lt;
        </button>
        <div className="font-bold text-xl">{`Week 16`}</div>
        <button
          className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none">
          <span className="sr-only">Next week</span>
          &gt;
        </button>
      </div>
      <div className="flex space-x-2 justify-center">
        <NavigationButton day="Dinsdag" date={"2023-04-18"} onClick={() => handleClick("Dinsdag")} isSelected={selectedDay === "Dinsdag"} />
        <NavigationButton day="Woensdag" date={"2023-04-19"} onClick={() => handleClick("Woensdag")} isSelected={selectedDay === "Woensdag"} />
        <NavigationButton day="Donderdag" date={"2023-04-20"} onClick={() => handleClick("Donderdag")} isSelected={selectedDay === "Donderdag"} />
        <NavigationButton day="Vrijdag" date={"2023-04-21"} onClick={() => handleClick("Vrijdag")} isSelected={selectedDay === "Vrijdag"} />
        <NavigationButton day="Zaterdag" date={"2023-04-22"} onClick={() => handleClick("Zaterdag")} isSelected={selectedDay === "Zaterdag"} />
        <NavigationButton day="Zondag" date={"2023-04-23"} onClick={() => handleClick("Zondag")} isSelected={selectedDay === "Zondag"} />
      </div>
    </nav>
  );
};

export default Navigation;
