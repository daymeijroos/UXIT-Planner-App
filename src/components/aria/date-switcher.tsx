import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import React, { useState } from "react";
import { getCurrentWeekNumber } from "../../../shared/date/dateHelperFunctions";

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
  const [weekNumber, setWeekNumber] = useState<number>(getCurrentWeekNumber(new Date()));
  const daysOfWeek = getDaysOfTheWeek(weekNumber);


  function getFirstDayOfTheWeek(year:number, weekNumber: number) {
    const firstDayOfTheYear = new Date(year, 0, 1);
    const daysToFirstDayOfWeek = (weekNumber - 1) * 7 - firstDayOfTheYear.getDay() + 1;

    return new Date(year, 0, daysToFirstDayOfWeek);
  }

  function getDaysOfTheWeek(weekNumber: number): Date[] {
    const year = new Date().getFullYear();
    const firstDayOfTheWeek = getFirstDayOfTheWeek(year, weekNumber);
    const daysOfTheWeek: Date[] = [];

    const daysInAWeek = 7;
    const millisecondsInADay = 24 * 60 * 60 * 1000;

    for (let i = 0; i < daysInAWeek; i++) {
      const date = new Date(firstDayOfTheWeek.getTime() + (i + 1) * millisecondsInADay);
      daysOfTheWeek.push(date);
    }
    return daysOfTheWeek;
  }

  function clickPreviousWeek() {
    setWeekNumber(weekNumber - 1);
    selectedDate.setDate(selectedDate.getDate() - 7);

    if (weekNumber === 1) {
      setWeekNumber(52);
      selectedDate.setFullYear(selectedDate.getFullYear());
    }
  }

  function clickNextWeek() {
    setWeekNumber(weekNumber + 1);
    selectedDate.setDate(selectedDate.getDate() + 7);

    if (weekNumber === 52) {
      setWeekNumber(1);
      selectedDate.setFullYear(selectedDate.getFullYear());
    }
  }

  return (
    <nav className="bg-white py-2 px-4 rounded-lg flex flex-col space-x-2 justify-center">
      <div className="text-center">
        <h2 className="font-bold text-2xl">{selectedDate.getFullYear()}</h2>
      </div>
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
