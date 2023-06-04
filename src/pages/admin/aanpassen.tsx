import React, { useState } from "react"
import { Button, NavigationBar, ToastService } from "../../components"
import { api } from "../../utils/api"
import { useAutoAnimate } from "@formkit/auto-animate/react"

export default function Aanpassen() {
  const context = api.useContext()
  const { mutate: removeSelectedStaffing } = api.staffing.removeStaffingAdmin.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
        ToastService.success("Het is gelukt!")
      })
    }
  })
  const { mutate: removeSelectedShift } = api.shift.removeShiftAdmin.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
        ToastService.success("Het is gelukt!")
      })
    }
  })
  const shifts = api.shift.getAllShifts.useQuery()
  const [expandedRow, setExpandedRow] = useState(null)
  const [staffingList] = useAutoAnimate()
  const [tableRow] = useAutoAnimate()

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

  const handleRemoveStaffing = (staffingId: string) => {
    try {
      removeSelectedStaffing({ staffing_id: staffingId })

    } catch (error) {
      console.error(error)
    }
  }

  const handleRemoveShift = (shiftId: string) => {
    try {
      removeSelectedShift({ shift_id: shiftId })

    } catch (error) {
      console.error(error)
    }
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
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center max-w-xs mb-2">
                            <p className="mr-6">{shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)} {shift.start.toString().slice(16, 21)}</p>
                            <div className="w-40">
                              <Button color="gray">Wijzig starttijd</Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center max-w-xs mb-2">
                            <p className="mr-6">{shift.end.toString().slice(8, 10)} {shift.end.toString().slice(3, 7)} {shift.end.toString().slice(11, 15)} {shift.start.toString().slice(16, 21)}</p>
                            <div className="w-40">
                              <Button color="gray">Wijzig eindtijd</Button>
                            </div>
                          </div>
                        </div>
                        <div className="w-40 ml-4">
                          <Button color="red" onPress={() => handleRemoveShift(shift.id)}>Verwijder shift</Button>
                        </div>
                      </div>
                      <div className="flex flex-col mb-4" ref={staffingList}>
                        {shift.staffings.map((staffing) => (
                          <div key={staffing.id} className="flex justify-between items-center max-w-xs mb-2">
                            <p>{staffing.user.name} {staffing.user.last_name}</p>
                            <div className="w-32">
                              <Button color="red" onPress={() => handleRemoveStaffing(staffing.id)}>Verwijder</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/*<div className="flex justify-center">*/}
                        <div className="">
                        <Button color="teal">Voeg staffing toe</Button>
                        </div>
                      {/*</div>*/}
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
