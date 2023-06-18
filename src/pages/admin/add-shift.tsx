


import { useRouter } from "next/router";
import { useState } from "react";
import { ToastService, TextField, Button, RangeCalendar, ButtonRound } from "../../components";
import { api } from "../../utils/api";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarGrid } from "../../components/atoms/input/calendar/calendar-grid";
import React from "react";
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';



interface ShiftTypeStaffing {
  [shiftTypeName: string]: number;
}

enum ShiftChoice {
  MORNING = "ochtend",
  AFTERNOON = "afternoon",
  AFTERNOON_EVENING = "afternoon_evening",
  CUSTOM = "custom",
  
}

const shiftChoiceDetails = {
  [ShiftChoice.MORNING]: {
    label: "Ochtend (11:45 - 15:00)",
    startHour: 11,
    startMinute: 45,
    endHour: 15,
    endMinute: 0,
  },
  [ShiftChoice.AFTERNOON]: {
    label: "Middag (14:00 - 17:15)",
    startHour: 14,
    startMinute: 0,
    endHour: 17,
    endMinute: 15,
  },
  [ShiftChoice.AFTERNOON_EVENING]: {
    label: "Opening (11:45 - 17:15)",
    startHour: 11,
    startMinute: 45,
    endHour: 17,
    endMinute: 15,
    }
};

export default function AddShiftPage() {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shiftTypeStaffing, setShiftTypeStaffing] = useState<ShiftTypeStaffing>({});
  const [selectedShift, setSelectedShift] = useState<ShiftChoice | null>(null);
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const router = useRouter();

  const getAllShiftTypeNames = api.schedule.getShiftTypes.useQuery();
  const shiftTypeNames = getAllShiftTypeNames.data?.map((shiftType) => shiftType.name) || [];
  const createNewShift = api.schedule.createShift.useMutation();



  const handleShiftTypeStaffingChange = (shiftTypeName: string, value: string) => {
    setShiftTypeStaffing((prevState: ShiftTypeStaffing) => ({
      ...prevState,
      [shiftTypeName]: parseInt(value, 10) || 0,
    }));
  };
 

  const handleStaffingIncrement = (shiftTypeName: string) => {
    setShiftTypeStaffing((prevState: ShiftTypeStaffing) => ({
      ...prevState,
      [shiftTypeName]: (prevState[shiftTypeName] || 0) + 1,
    }));
  };

  const handleStaffingDecrement = (shiftTypeName: string) => {
    setShiftTypeStaffing((prevState: ShiftTypeStaffing) => ({
      ...prevState,
      [shiftTypeName]: Math.max((prevState[shiftTypeName] || 0) - 1, 0),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShift) {
      return;
    }
    if (!selectedDate) {
      return;
    }

    let start;
    let end;

    if (selectedShift === ShiftChoice.CUSTOM) {
      if (!customStartTime || !customEndTime) {
        return;
      }

      start = new Date(selectedDate);
      const [startHour, startMinute] = customStartTime.split(":");
      start.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

      end = new Date(selectedDate);
      const [endHour, endMinute] = customEndTime.split(":");
      end.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
    } else {
      const { startHour, startMinute, endHour, endMinute } = shiftChoiceDetails[selectedShift];

      start = new Date(selectedDate);
      start.setHours(startHour, startMinute, 0, 0);

      end = new Date(selectedDate);
      end.setHours(endHour, endMinute, 0, 0);
    }

    try {
      createNewShift.mutate({
        start,
        end,
        staff_required: Object.entries(shiftTypeStaffing).map(([shiftTypeName, amount]) => ({
          shift_type: shiftTypeName,
          amount,
        })),
      });
      ToastService.success('Shift is toegevoeg');
      router.push("/");
    } catch (error) {
      ToastService.error('Er is iets verkeerd gegaan!');
    }
  };

  return (
    <div className="container mx-auto max-w-[500px] m-auto">
      <h1 className="text-2xl font-bold mb-4 text-center m-10">SHIFT TOEVOEGEN</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 m-5">
          <h2 className="font-bold">Selecteer de datum:</h2>

          {/* input date */}
          <div className="flex justify-center">
            <input type="date"
              className="border-2 border-gray-300 p-2 w-full"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
              required

            />
          </div>


        </div>

        <div className="mb-4 m-5 mt-10">
        <h2 className="font-bold">Kies de shift:</h2>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="morning"
            name="shift"
            value="ochtend"
            className="h-6 w-6 mr-2 border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="morning"
            className="text-lg font-medium text-gray-700"
          >
            Ochtend (11:45 - 15:00)
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="afternoon"
            name="shift"
            value={ShiftChoice.AFTERNOON}
            checked={selectedShift === ShiftChoice.AFTERNOON}
            onChange={() => setSelectedShift(ShiftChoice.AFTERNOON)}
            className="h-6 w-6 mr-2 border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="afternoon"
            className="text-lg font-medium text-gray-700"
          >
            {shiftChoiceDetails[ShiftChoice.AFTERNOON].label}
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="afternoon_evening"
            name="shift"
            value={ShiftChoice.AFTERNOON_EVENING}
            checked={selectedShift === ShiftChoice.AFTERNOON_EVENING}
            onChange={() => setSelectedShift(ShiftChoice.AFTERNOON_EVENING)}
            className="h-6 w-6 mr-2 border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="afternoon_evening"
            className="text-lg font-medium text-gray-700"
          >
            {shiftChoiceDetails[ShiftChoice.AFTERNOON_EVENING].label}
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="custom"
            name="shift"
            value={ShiftChoice.CUSTOM}
            checked={selectedShift === ShiftChoice.CUSTOM}
            onChange={() => setSelectedShift(ShiftChoice.CUSTOM)}
            className="h-6 w-6 mr-2 border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="custom"
            className="text-lg font-medium text-gray-700"
          >
            Aangepaste tijden
          </label>
        </div>
        {selectedShift === ShiftChoice.CUSTOM && (
          <div className="flex items-center mt-2">
            <div className="mr-2">Starttijd:</div>
            <TextField type="time" id="customStartTime" value={customStartTime} onChange={(value) => setCustomStartTime(value)} />
            <div className="mx-2">Eindtijd:</div>
            <TextField type="time" id="customEndTime" value={customEndTime} onChange={(value) => setCustomEndTime(value)} />
          </div>
        )}
</div>


        {
          <div className="mb-4 m-5 mt-10">
            <h2 className="font-bold">Benodigde personeel per locatie:</h2>
            {shiftTypeNames.map((shiftTypeName) => (
              <div key={shiftTypeName} className="flex items-center mb-2">
              <label htmlFor={shiftTypeName} className="mr-2 text-lg font-medium text-gray-700">
                {shiftTypeName}
              </label>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleStaffingDecrement(shiftTypeName)}
                  className="rounded-l-lg px-4 py-2 bg-gray-200 text-gray-700 text-3xl focus:outline-none"
                >
                  -
                </button>
                <input
                  type="text"
                  id={shiftTypeName}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={shiftTypeStaffing[shiftTypeName] !== undefined ? String(shiftTypeStaffing[shiftTypeName]) : ""}
                  placeholder="0"
                  onChange={(e) => handleShiftTypeStaffingChange(shiftTypeName, e.target.value)}
                  className="w-16 px-4 py-2 bg-white text-gray-700 text-xl focus:outline-none text-center cursor-auto"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleStaffingIncrement(shiftTypeName)}
                  className="rounded-r-lg px-4 py-2 bg-gray-200 text-gray-700 text-3xl focus:outline-none"
                >
                  +
                </button>
              </div>


            </div>
            
            ))}
          </div>
        }
        <Button type="submit">Shift toevoegen</Button>
      </form>
    </div>
  );
}

