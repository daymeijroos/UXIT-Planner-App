import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import React, { useState } from "react";
import { getCurrentWeekNumber } from "../../utils/date";

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

type DateSwitcherProps = {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}


export const DateSwitcher = ({ setSelectedDate, selectedDate }: DateSwitcherProps) => {
  const [weekNumber, setWeekNumber] = useState(getCurrentWeekNumber());
  const daysOfWeek = getDaysOfWeek(weekNumber);


  function getCurrentWeekNumber() {
    const today = new Date();
    const firstDayOfTheYear = new Date(today.getFullYear(), 0, 1);
    const daysPassedOfTheYear = (today.getTime() - firstDayOfTheYear.getTime()) / 86400000;
    return Math.ceil((daysPassedOfTheYear + firstDayOfTheYear.getDay()) / 7);
  }

  function getDaysOfWeek(weekNumber: number) {
    const year = new Date().getFullYear();
    const firstDayOfWeek = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const daysOfWeek: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek.getTime() - 0.01);
      console.log(firstDayOfWeek.getTime())
      date.setDate(date.getDate() + i);
      daysOfWeek.push(date);
    }
    console.log(daysOfWeek);
    return daysOfWeek;
  }

  function clickPreviousWeek() {
    setWeekNumber(weekNumber - 1);
    selectedDate.setDate(selectedDate.getDate() - 7);

  }

  function clickNextWeek() {
    setWeekNumber(weekNumber + 1);
    selectedDate.setDate(selectedDate.getDate() + 7);
  }

  return (
    <nav className="bg-white py-2 px-4 rounded-lg flex flex-col space-x-2 justify-center">
      <div className="flex items-center justify-between border-black border-2 my-2">
          <button
            className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            onClick={clickPreviousWeek}>&lt;
            <span className="sr-only">Previous week</span>
          </button>
          <div className="font-bold text-xl">Week {weekNumber}</div>
          <button className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none" onClick={clickNextWeek}>&gt;
            <span className="sr-only">Next week</span>
          </button>
      </div>
      <div className="flex space-x-2 justify-center">
        {daysOfWeek.map((date) => (
          <DateSwitcherButton
            key={date.toISOString().slice(0, 10)}
            day={date.toLocaleString('default', { weekday: 'long' })}
            date={date.toISOString().slice(0, 10)}
            onClick={() => setSelectedDate(date)}
            isSelected={selectedDate.getTime() === date.getTime()}
          />
        ))}
      </div>
    </nav>
  );
};
