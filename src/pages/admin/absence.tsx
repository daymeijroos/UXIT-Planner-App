import Datepicker from "react-tailwindcss-datepicker";
import React, { useState } from "react";

export default function Absence() {

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }
  return (
    <div className={"text-center p-40 h-screen flex justify-center mx-auto"}>
      <div className={"p-10"}>
        <h1>Absence Form</h1>
        <div className={"mt-5"}>
          <span className={"flex text-left"}>Select Date Range</span>
          <Datepicker
            primaryColor={"teal"}
            // container
            containerClassName="flex justify-center items-center"
            displayFormat={"DD-MM-YYYY"}
            // text input
            inputClassName="text-teal-300 text-center w-96 mr-1 border-2 border-teal-300 rounded text-xl"// Pas de primaire kleur
            // calendar icon
            toggleClassName="text-white bg-teal-300 rounded p-1" // Pas de dagklasse toe
            showShortcuts={false}
            value={value}
            onChange={handleValueChange}
          />
        </div>
      </div>
    </div>
  )
}
