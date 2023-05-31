import React from 'react';
import { NavigationBar } from "../../components"
import { api } from "../../utils/api";

const Aanpassen = () => {
  const shifts = api.shift.getAllShifts.useQuery()

  if (shifts.isLoading) {
    return <div>loading...</div>
  }

  if (shifts.error) {
    return <div>{shifts.error.message}</div>
  }

  const handleUserClick = (shiftId) => {
    console.log(shiftId);
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Datum
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Tijdslot
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Staffings
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {
            shifts.data?.map((shift) => (
              <tr key={shift.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleUserClick(shift.id)}>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{shift.start.toString().slice(3,15)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{shift.start.toString().slice(16,21)} tot {shift.end.toString().slice(16,21)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">
                    {shift.staffings && shift.staffings.map((staffing, index) => (
                      <span key={index}>{staffing}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Aanpassen;
