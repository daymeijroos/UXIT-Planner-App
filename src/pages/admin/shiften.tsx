import React, { useState } from "react";
import { Button, NavigationBar, ToastService } from "../../components";
import { api } from "../../utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Edit, Minimize2, Trash2 } from "react-feather";
import { Select } from "../../components/atoms/input/Selector";
import { Item } from "react-stately";
import type { User } from "@prisma/client";
import type { ShiftWithStaffings } from "../../../server/types/shift";
import type { Staffing } from "@prisma/client";
import { prisma } from "../../../server/db";
import { StaffingWithColleagues } from "../../types/StaffingWithColleagues";

const Shiften = () => {
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
  const { mutate: addStaffing } = api.staffing.addStaffing.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
        ToastService.success("Het is gelukt!")
      })
    }
  })

  const users = api.user.getUsersWithPreferencesAndStaffings.useQuery()
  const availableUsers: User[] = []

  const shifts = api.shift.getAllShifts.useQuery()
  const [expandedRow, setExpandedRow] = useState<null | string>(null)
  const [staffingList] = useAutoAnimate()

  if (shifts.isLoading) {
    return <div>loading...</div>
  }

  if (shifts.error) {
    return <div>{shifts.error.message}</div>
  }

  const expandRow = (shift: ShiftWithStaffings) => {
    if (expandedRow === shift.id) {
      setExpandedRow(null)
    } else {
      setExpandedRow(shift.id)
      const staffedUsers: User[] = []

      shift.staffings?.map((staffing: StaffingWithColleagues) => {
        if(staffing?.user) {
          staffedUsers.push(staffing.user)
        }
      })

      users.data?.map((user: User) => {
        if (!staffedUsers.some((staffedUser: User) => staffedUser.id === user.id)) {
          availableUsers.push(user)
        }
      })
    }
    console.log(expandedRow);
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

  const handleAddStaffing = (shiftId: string) => {
    const spanContent = document.getElementById("userSpan")?.textContent ?? ""
    users.data?.map((user) => {
        if (spanContent === user.name) {
          const selectedUserId: string = user.id
          try {
            addStaffing({ shift_type_name: "Balie", user_id: selectedUserId, shift_id: shiftId })
          } catch (error) {
            console.log(error)
          }
        }
      })
  }

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center p-4 mb-4">
        <h1 className="text-xl font-bold mx-auto">Shiften</h1>
      </div>
      <div className="flex justify-center items-center">
        <table className="w-full md:max-w-2xl divide-y divide-gray-200 border-2 border-black">
          <thead className="bg-gray-50 border-2 border-black">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-2 border-black">
              Datum
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-2 border-black">
              Tijdslot
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider border-2 border-black">
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
                  onClick={() => expandRow(shift)}
                >
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div
                      className="text-sm text-gray-900">{shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div className="text-sm text-gray-900">
                      {shift.start.toString().slice(16, 21)} tot {shift.end.toString().slice(16, 21)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div className="text-sm text-gray-900">
                      {shift.staffings.map((staffing) => (
                        <div key={staffing.id}>{staffing.user.name} {staffing.user.last_name}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {(expandedRow === shift.id) && (
                <tr>
                  <td colSpan={3}>
                    <div className="p-4 relative">
                      <div className="flex flex-col justify-between mb-4">
                        <div className="flex flex-col mx-auto">
                          <p className="mb-2 font-bold text-center">Starttijd</p>
                          <div className="flex justify-between items-center max-w-xs mb-4">
                            <div className="flex-grow">
                              <p className="border-b-2 border-l-2 border-t-2 border-black p-4 text-center">
                                {/*<DateField label={"plswork"} defaultValue={shift.start}></DateField>*/}
                                {shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)} {shift.start.toString().slice(16, 21)}
                              </p>
                            </div>
                            <div className="w-30">
                              <Button aria-label="Wijzig starttijd" title="Wijzig starttijd" color="gray">
                                <Edit size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mb-2 font-bold text-center">Eindtijd</p>
                          <div className="flex justify-between items-center max-w-xs mb-2">
                            <div className="flex-grow">
                              <p className="border-b-2 border-l-2 border-t-2 border-black p-4 text-center">
                                {shift.end.toString().slice(8, 10)} {shift.end.toString().slice(3, 7)} {shift.end.toString().slice(11, 15)} {shift.end.toString().slice(16, 21)}
                              </p>
                            </div>
                            <div className="w-30">
                              <Button aria-label="Wijzig eindtijd" title="Wijzig eindtijd" color="gray">
                                <Edit size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="w-30 ml-4 absolute top-4 right-4">
                          <Button aria-label="Verwijder shift" title="Verwijder shift" color="red" onPress={() => handleRemoveShift(shift.id)}>
                            <Trash2 size="24" className="stroke-5/4" />
                          </Button>
                        </div>
                        <div className="w-30 ml-4 absolute left-0 top-4">
                          <Button aria-label="Klap shift in" title="Klap shift in" color="teal" onClick={() => expandRow(shift)}>
                            <Minimize2 size="24" className="stroke-5/4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col max-w-xs mx-auto" ref={staffingList}>
                        <p className="mb-4 font-bold text-center">Ingeroosterde vrijwilligers</p>
                        {shift.staffings.map((staffing) => (
                          <div key={staffing.id} className="flex items-center mb-2">
                            <div className="flex-grow">
                              <p className="border-b-2 border-l-2 border-t-2 border-black p-4">{staffing.user.name} {staffing.user.last_name}</p>
                            </div>
                            <div>
                              <Button
                                aria-label="Verwijder"
                                title="Verwijder"
                                color="red"
                                onPress={() => handleRemoveStaffing(staffing.id)}>
                                <Trash2 size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        {/*// TODO needs to be availableUsers*/}
                        <Select label="Medewerker / Vrijwilliger" items={users.data}>
                          {(item) => <Item>{item.name}</Item>}
                        </Select>
                      </div>
                      <Button onPress={() => handleAddStaffing(shift.id)} color="teal">Voeg vrijwilliger toe</Button>
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

export default Shiften;
