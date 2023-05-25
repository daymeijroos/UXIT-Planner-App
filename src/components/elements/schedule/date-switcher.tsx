import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import React from "react";

interface NavigationButtonProps {
  day: string;
  date: string;
  onClick: () => void;
  isSelected: boolean;
}

const DateSwitcherButton = (props: NavigationButtonProps) => {
  const ref = React.useRef(null);
  const { buttonProps, isPressed } = useButton({
    onPress: props.onClick,
  }, ref)
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      className={`${isPressed ? "bg-teal" : "bg-teal"
        } text-black rounded-full h-12 w-12 flex flex-col items-center justify-center focus:outline-none focus:ring-4 ${isFocusVisible ? "ring-blue-300" : ""
        } ${props.isSelected
          ? "bg-teal border-black border-2"
          : isPressed
            ? "bg-teal"
            : "bg-white"
        } dark:bg-[#2B303C] dark:text-white dark:border-teal  hover:cursor-pointer`}
      {...buttonProps}
      {...focusProps}>
      <span className="sr-only">{props.day}</span>
      <span className="text-lg font-bold">{props.day.slice(0, 2)}</span>
      <span className="text-sm">{new Date(props.date).getDate()}</span>
    </div>
  );
};

interface DateSwitcherProps {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}

export const DateSwitcher = ({ setSelectedDate, selectedDate }: DateSwitcherProps) => {
  const tuesday = new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))
  const wednesday = new Date(new Date('2023-04-19T00:00:00Z').setHours(0, 0, 0, 0))
  const thursday = new Date(new Date('2023-04-20T00:00:00Z').setHours(0, 0, 0, 0))
  const friday = new Date(new Date('2023-04-21T00:00:00Z').setHours(0, 0, 0, 0))
  const saturday = new Date(new Date('2023-04-22T00:00:00Z').setHours(0, 0, 0, 0))
  const sunday = new Date(new Date('2023-04-23T00:00:00Z').setHours(0, 0, 0, 0))


  return (
    <nav className="bg-white rounded-lg flex flex-col space-x-2 justify-center dark:bg-[#2B303C] dark:text-white ">
      <div className="flex items-center justify-between border-black border-2 dark:border-steel">
        <button
          className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none ">
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
        <DateSwitcherButton day="Dinsdag" date={"2023-04-18"} onClick={() => setSelectedDate(tuesday)} isSelected={selectedDate.getTime() === tuesday.getTime()} />
        <DateSwitcherButton day="Woensdag" date={"2023-04-19"} onClick={() => setSelectedDate(wednesday)} isSelected={selectedDate.getTime() === wednesday.getTime()} />
        <DateSwitcherButton day="Donderdag" date={"2023-04-20"} onClick={() => setSelectedDate(thursday)} isSelected={selectedDate.getTime() === thursday.getTime()} />
        <DateSwitcherButton day="Vrijdag" date={"2023-04-21"} onClick={() => setSelectedDate(friday)} isSelected={selectedDate.getTime() === friday.getTime()} />
        <DateSwitcherButton day="Zaterdag" date={"2023-04-22"} onClick={() => setSelectedDate(saturday)} isSelected={selectedDate.getTime() === saturday.getTime()} />
        <DateSwitcherButton day="Zondag" date={"2023-04-23"} onClick={() => setSelectedDate(sunday)} isSelected={selectedDate.getTime() === sunday.getTime()} />
      </div>
    </nav>
  );
};
