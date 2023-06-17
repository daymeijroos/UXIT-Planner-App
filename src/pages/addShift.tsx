import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, TextField, ToastService } from "../components";
import { api } from "../utils/api";
import { boolean } from "zod";

interface ShiftTypeStaffing {
  [shiftTypeName: string]: number;
}

enum ShiftChoice {
  MORNING = "ochtend",
  AFTERNOON = "afternoon",
  AFTERNOON_EVENING = "middag-avond",
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
  const [date, setDate] = useState("");
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
      console.error("Please select a shift");
      return;
    }
    if (!date) {
      console.error("Please select a date");
      return;
    }

    let start;
    let end;

    if (selectedShift === ShiftChoice.CUSTOM) {
      if (!customStartTime || !customEndTime) {
        return;
      }

      start = new Date(date);
      const [startHour, startMinute] = customStartTime.split(":");
      start.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

      end = new Date(date);
      const [endHour, endMinute] = customEndTime.split(":");
      end.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
    } else {
      const { startHour, startMinute, endHour, endMinute } = shiftChoiceDetails[selectedShift];

      start = new Date(date);
      start.setHours(startHour, startMinute, 0, 0);

      end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);
    }

    // TODO
    // If shift already exists with same start and end time return error

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
      // show error use ToastService
      ToastService.error('Er is iets verkeerd gegaan!');
    }
  };

  return (
    <div className="container mx-auto max-w-[500px] m-auto">
      <h1 className="text-2xl font-bold mb-4 text-center m-10">SHIFT TOEVOEGEN</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 m-5">
          <h2 className="font-bold">Selecteer de datum:</h2>
          <TextField type="date" id="date" value={date} onChange={(value) => setDate(value)} />
        </div>

        <div className="mb-4 m-5 mt-10">
          <h2 className="font-bold">Selecteer de shift:</h2>
          <div>
            <input
              type="radio"
              id="morning"
              name="shift"
              value={ShiftChoice.MORNING}
              checked={selectedShift === ShiftChoice.MORNING}
              onChange={() => setSelectedShift(ShiftChoice.MORNING)}
            />
            <label htmlFor="morning">{shiftChoiceDetails[ShiftChoice.MORNING].label}</label>
          </div>
          <div>
            <input
              type="radio"
              id="afternoon"
              name="shift"
              value={ShiftChoice.AFTERNOON}
              checked={selectedShift === ShiftChoice.AFTERNOON}
              onChange={() => setSelectedShift(ShiftChoice.AFTERNOON)}
            />
            <label htmlFor="afternoon">{shiftChoiceDetails[ShiftChoice.AFTERNOON].label}</label>
          </div>
          <div>
            <input
              type="radio"
              id="afternoon_evening"
              name="shift"
              value={ShiftChoice.AFTERNOON_EVENING}
              checked={selectedShift === ShiftChoice.AFTERNOON_EVENING}
              onChange={() => setSelectedShift(ShiftChoice.AFTERNOON_EVENING)}
            />
            <label htmlFor="afternoon_evening">{shiftChoiceDetails[ShiftChoice.AFTERNOON_EVENING].label}</label>
          </div>
          
          <div>
            <input
              type="radio"
              id="custom"
              name="shift"
              value={ShiftChoice.CUSTOM}
              checked={selectedShift === ShiftChoice.CUSTOM}
              onChange={() => setSelectedShift(ShiftChoice.CUSTOM)}
            />
            <label htmlFor="custom">Aangepaste tijden</label>
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
            <h2 className="font-bold">Selecteer de bezetting per shift type:</h2>
            {shiftTypeNames.map((shiftTypeName) => (
              <div key={shiftTypeName} className="flex items-center mb-2">
                <label htmlFor={shiftTypeName} className="mr-2">{shiftTypeName}</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleStaffingDecrement(shiftTypeName)}
                    className="rounded-full px-3 py-1 bg-gray-200 text-gray-700 mr-2"
                  >
                    -
                  </button>
                  <TextField
                    type="number"
                    id={shiftTypeName}
                    value={String(shiftTypeStaffing[shiftTypeName]) || ""}
                    placeholder="0"
                    onChange={(value) => handleShiftTypeStaffingChange(shiftTypeName, value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleStaffingIncrement(shiftTypeName)}
                    className="rounded-full px-3 py-1 bg-gray-200 text-gray-700 ml-2"
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

