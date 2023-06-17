import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, TextField } from "../components";
import { api } from "../utils/api";

interface ShiftTypeStaffing {
  [shiftTypeName: string]: number;
}

enum ShiftChoice {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  CUSTOM = "custom",
}

const shiftChoiceDetails = {
  [ShiftChoice.MORNING]: {
    label: "Ochtend (11:45 - 15:00)",
    startHour: 9,
    endHour: 14,
  },
  [ShiftChoice.AFTERNOON]: {
    label: "Middag (14:00 - 17:15)",
    startHour: 14,
    endHour: 17,
  },
};

export default function AddShiftPage() {
  const [date, setDate] = useState("");
  const [shiftTypeStaffing, setShiftTypeStaffing] = useState<ShiftTypeStaffing>({});
  const [selectedShift, setSelectedShift] = useState<ShiftChoice | null>(null);
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getAllShifts = api.schedule.getAllShifts.useQuery();
  const getAllShiftTypeNames = api.schedule.getShiftTypes.useQuery();
  const shiftTypeNames = getAllShiftTypeNames.data?.map((shiftType) => shiftType.name) || [];
  const response = api.schedule.createShift.useMutation();

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
      setError("Selecteer een shift");
      return;
    }
    if (!date) {
      setError("Selecteer een datum");
      return;
    }

    let start: Date, end: Date;
    if (selectedShift === ShiftChoice.CUSTOM) {
      if (!customStartTime || !customEndTime) {
        setError("Vul een geldig tijdstip in");
        return;
      }
      start = new Date(`${date}T${customStartTime}`);
      end = new Date(`${date}T${customEndTime}`);
    } else {
      const { startHour, endHour } = shiftChoiceDetails[selectedShift];
      start = new Date(date);
      start.setHours(startHour, 0, 0, 0);
      end = new Date(date);
      end.setHours(endHour, 0, 0, 0);
    }

    const existingShift = getAllShifts.data?.find((shift) => shift.start === start && shift.end === end);
    if (existingShift) {
      setError("Er bestaat al een shift met dezelfde start- en einddatum");
      return;
    }

    try {
      response.mutate({
        start,
        end,
        staff_required: Object.entries(shiftTypeStaffing).map(([shiftTypeName, amount]) => ({
          shift_type: shiftTypeName,
          amount,
        })),
      });
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-[500px] m-auto">
      <h2 className="text-2xl font-bold mb-4">Shift toevoegen</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="font-bold">Datum:</h2>
          <TextField type="date" id="date" value={date} onChange={(value) => setDate(value)} />
        </div>

        <div className="mb-4 mt-10">
          <h2 className="font-bold">Selecteer Tijdstip:</h2>
          <div>
            {Object.entries(shiftChoiceDetails).map(([shiftChoice, details]) => (
              <div key={shiftChoice}>
                <input
                  type="radio"
                  id={shiftChoice}
                  name="shift"
                  value={shiftChoice}
                  checked={selectedShift === shiftChoice}
                  onChange={() => setSelectedShift(shiftChoice as ShiftChoice)}
                />
                <label htmlFor={shiftChoice}>{details.label}</label>
              </div>
            ))}
            <div>
              <input
                type="radio"
                id={ShiftChoice.CUSTOM}
                name="shift"
                value={ShiftChoice.CUSTOM}
                checked={selectedShift === ShiftChoice.CUSTOM}
                onChange={() => setSelectedShift(ShiftChoice.CUSTOM)}
              />
              <label htmlFor={ShiftChoice.CUSTOM}>Aangepast</label>
            </div>
          </div>
        </div>

        {selectedShift && selectedShift !== ShiftChoice.CUSTOM && (
          <div className="mb-4 mt-10">
            <h2 className="font-bold">Selecteer de benodigde personeelsbezetting per shifttype:</h2>
            {shiftTypeNames.map((shiftTypeName) => (
              <div key={shiftTypeName} className="flex items-center mb-2">
                <label htmlFor={shiftTypeName} className="mr-2">
                  {shiftTypeName}
                </label>
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
        )}

        {selectedShift === ShiftChoice.CUSTOM && (
          <div className="mb-4 mt-10">
            <h2 className="font-bold">Voeg aangepaste shifttijden toe:</h2>
            <div className="flex items-center mb-2">
              <label htmlFor="custom-start-time" className="mr-2">
                Starttijd:
              </label>
              <TextField
                type="time"
                id="custom-start-time"
                value={customStartTime}
                onChange={(value) => setCustomStartTime(value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="custom-end-time" className="mr-2">
                Eindtijd:
              </label>
              <TextField
                type="time"
                id="custom-end-time"
                value={customEndTime}
                onChange={(value) => setCustomEndTime(value)}
              />
            </div>
            <h2 className="font-bold mt-10">Benodigd personeel per shifttype:</h2>
            {shiftTypeNames.map((shiftTypeName) => (
              <div key={shiftTypeName} className="flex items-center mb-2">
                <label htmlFor={shiftTypeName} className="mr-2">
                  {shiftTypeName}
                </label>
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
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Button type="submit">Shift toevoegen</Button>
      </form>
    </div>
  );
}
