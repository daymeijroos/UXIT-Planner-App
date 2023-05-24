import { getCurrentWeekNumber, getDaysOfTheWeek } from "../../../../shared/date/dateHelperFunctions";
import { DateSwitcherButton } from "./date-switcher-button"
import { useEffect, useState } from "react";

type DateSwitcherProps = {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}

const millisecondsPerWeek = 604800000;

export const DateSwitcher = ({ setSelectedDate, selectedDate }: DateSwitcherProps) => {
  const daysOfTheWeek = getDaysOfTheWeek(selectedDate);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dayButtonPressed, setDayButtonPressed] = useState(false);
  const [onPressCount, setOnPressCount] = useState(0);

  function clickPreviousWeek() {
    const date = new Date(selectedDate.getTime() - millisecondsPerWeek);
    setSelectedDate(date);
    setDayButtonPressed(false); // Reset dayButtonPressed when changing weeks
  }

  function clickNextWeek() {
    const date = new Date(selectedDate.getTime() + millisecondsPerWeek);
    setSelectedDate(date);
    setDayButtonPressed(false);
  }

  const handleDayButtonPress = (date: Date) => {
    setSelectedDate(date);
    setOnPressCount((count) => count + 1);
  };

  useEffect(() => {
    const currentWeekNumber = getCurrentWeekNumber(selectedDate);
    const previousWeekDate = new Date(selectedDate.getTime() - millisecondsPerWeek);

    if (
      initialLoad &&
      (currentWeekNumber === 12 || currentWeekNumber === 44) &&
      selectedDate.getTime() !== previousWeekDate.getTime() &&
      onPressCount === 0
    ) {
      const previousDayOfWeek = previousWeekDate.getDay();
      setSelectedDate(
        currentWeekNumber === 12
          ? daysOfTheWeek[previousDayOfWeek]
          : daysOfTheWeek[previousDayOfWeek - 1]
      );
      setInitialLoad(false);
    } else if (initialLoad) {
      // Select the current date when initialLoad is true
      setSelectedDate(new Date());
      setInitialLoad(false);
    }
  }, [selectedDate, initialLoad, dayButtonPressed, daysOfTheWeek, onPressCount]);




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
        <div className="font-bold text-xl">Week {getCurrentWeekNumber(selectedDate)}</div>
        <button className="text-black rounded-full w-8 h-8 flex items-center justify-center focus:outline-none" onClick={clickNextWeek}>&gt;
          <span className="sr-only">Next week</span>
        </button>
      </div>
      <div className="flex space-x-2 justify-center">
        {getDaysOfTheWeek(selectedDate).map((date) => {
          return date
        }).map((date) => (
          <DateSwitcherButton
            key={date.getDate()}
            date={date}
            onPress={() => {
              setSelectedDate(date);
              handleDayButtonPress(date);
            }}
            selectedDate={selectedDate}
          />
        ))}
      </div>
    </nav>
  );
};
