import React, { useState } from "react"
import { Button, NavigationBar, ToastService } from "../../components"
import { api } from "../../utils/api"
import { useMutation } from "react-query"
import { Shift } from "@prisma/client"
import { string } from "zod"

export default function Aanpassen() {
  const context = api.useContext()
  const shifts = api.shift.getAllShifts.useQuery()
  const [expandedRow, setExpandedRow] = useState(null)

  if (shifts.isLoading) {
    return <div>loading...</div>
  }

  if (shifts.error) {
    return <div>{shifts.error.message}</div>
  }

  const expandRow = (shiftId: string) => {
    if (expandedRow === shiftId) {
      setExpandedRow(null)
    } else {
      setExpandedRow(shiftId)
    }
  }
  
  const handleRemoveStaffing = async (shiftId: string, staffingId: string) => {
    // try {
    //   const response = await mutation.mutate({ shiftId: shiftId, staffingId: staffingId });
    //
    //   console.log(response.data)
    // } catch (error) {
    //   console.error(error)
    // }
    console.log(shiftId)
    console.log(staffingId)
  }

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
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Datum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Tijdslot
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
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
                  onClick={() => expandRow(shift.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div
                      className="text-sm text-gray-900">{shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div className="text-sm text-gray-900">
                      {shift.start.toString().slice(16, 21)} tot {shift.end.toString().slice(16, 21)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border border-black">
                    <div className="text-sm text-gray-900">
                      {shift.staffings.map((staffing) => (
                        <div key={staffing.id}>{staffing.user.name} {staffing.user.last_name}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {expandedRow === shift.id && (
                <tr>
                  <td colSpan="3">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center">
                            <p>{shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)}</p>
                            <button className="px-2 py-1 bg-gray-200 rounded">Wijzig starttijd</button>
                          </div>
                          <div className="flex items-center mt-2">
                            <p>{shift.end.toString().slice(8, 10)} {shift.end.toString().slice(3, 7)} {shift.end.toString().slice(11, 15)}</p>
                            <button className="px-2 py-1 bg-gray-200 rounded">Wijzig eindtijd</button>
                          </div>
                        </div>
                        <Button className="px-4 py-2 bg-red-500 text-white rounded">Verwijder shift</Button>
                      </div>
                      <div className="flex flex-col mb-4">
                        {shift.staffings.map((staffing) => (
                          <div key={staffing.id} className="flex items-center mb-2">
                            <p>{staffing.user.name} {staffing.user.last_name}</p>
                            <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => handleRemoveStaffing(shift.id, staffing.id)}>Verwijder</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-start">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">Voeg staffing toe</button>
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
  )
}
