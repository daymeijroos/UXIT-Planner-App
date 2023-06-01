import React, { useState } from "react";
import { Button, NavigationBar } from "../../components";
import { api } from "../../utils/api";

const Aanpassen = () => {
  const shifts = api.shift.getAllShifts.useQuery();
  const [expandedRow, setExpandedRow] = useState(null);

  if (shifts.isLoading) {
    return <div>loading...</div>;
  }

  if (shifts.error) {
    return <div>{shifts.error.message}</div>;
  }

  const handleUserClick = (shiftId) => {
    if (expandedRow === shiftId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(shiftId);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mx-auto">Shifts</h1>
        <p className="text-sm">{shifts.data?.length} Shifts</p>
      </div>
      <div className="flex justify-center items-center">
        <table className="w-full md:max-w-2xl divide-y divide-gray-200 border-2 border-black">
          <thead className="bg-gray-50 border-2 border-black">
          <tr>
            <th scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Datum
            </th>
            <th scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Tijdslot
            </th>
            <th scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Staffings
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {shifts.data?.map((shift) => (
            <React.Fragment key={shift.id}>
              {expandedRow !== shift.id && (
                <tr
                  className="hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleUserClick(shift.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div className="text-sm text-gray-900">{shift.start.toString().slice(3, 15)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div className="text-sm text-gray-900">
                      {shift.start.toString().slice(16, 21)} tot {shift.end.toString().slice(16, 21)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div className="text-sm text-gray-900">
                      <div>
                        {shift.staffings.map((staffing) => (
                          <div key={staffing.id}>{staffing.user.name} {staffing.user.last_name}</div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {expandedRow === shift.id && (
                <tr>
                  <td colSpan="3">
                    <div className="bg-white p-4 border border-black">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-900">{shift.start.toString().slice(3, 15)} {shift.start.toString().slice(16, 21)}</div>
                        <div className="text-sm text-gray-900">{shift.end.toString().slice(3, 15)} {shift.end.toString().slice(16, 21)}</div>
                        <Button color="red" className="w-40">Verwijder shift</Button>
                      </div>
                      <div className="items-center">
                        <div>
                          {shift.staffings.map((staffing) => (
                            <div key={staffing.id} className="flex items-center">
                              <div
                                className="text-sm text-gray-900">{staffing.user.name} {staffing.user.last_name}</div>
                              <Button color="red" className="ml-2">Verwijder staffing</Button>
                            </div>
                          ))}
                        </div>
                        <Button>Voeg staffing toe</Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
      <NavigationBar />
    </div>
  );
};

export default Aanpassen;
