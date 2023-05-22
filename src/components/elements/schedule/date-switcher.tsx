import { getCurrentWeekNumber, getDaysOfTheWeek } from "../../../../shared/date/dateHelperFunctions";
import { DateSwitcherButton } from "./date-switcher-button"
import {useEffect} from "react";

type DateSwitcherProps = {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}

const millisecondsPerWeek = 604800000;

export const DateSwitcher = ({ setSelectedDate, selectedDate }: DateSwitcherProps) => {

  const daysOfTheWeek = getDaysOfTheWeek(selectedDate);

  function clickPreviousWeek() {
    const date = new Date(selectedDate.getTime() - millisecondsPerWeek);
    setSelectedDate(date);
  }

  function clickNextWeek() {
    const date = new Date(selectedDate.getTime() + millisecondsPerWeek);
    setSelectedDate(date);
  }

  useEffect(() => {
    const isDateInRangeOfTheWeek = daysOfTheWeek.some((date) => date.toDateString() === selectedDate.toDateString());

    if (!isDateInRangeOfTheWeek) {
      setSelectedDate(daysOfTheWeek[0]);
    }
  }, [selectedDate, daysOfTheWeek, setSelectedDate]);


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
            onPress={() => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        ))}
      </div>
    </nav>
  );
};
