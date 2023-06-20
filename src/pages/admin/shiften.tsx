import React, {useEffect, useState} from "react"
import {Button, NavigationBar, ToastService} from "../../components"
import {api} from "../../utils/api"
import {useAutoAnimate} from "@formkit/auto-animate/react"
import {CheckSquare, Edit, Minimize2, Trash2} from "react-feather"
import {Select} from "../../components/atoms/input/Selector"
import {Item} from "react-stately"
import type {User} from "@prisma/client"
import type {ShiftWithStaffings} from "../../../server/types/shift"
import {DatetimeField} from "../../components/atoms/input/calendar/datetime-field"
import {parseDateTime} from "@internationalized/date"
import {DateTime} from "next-auth/providers/kakao"
import {DateValue} from "react-aria"
import {Shift} from "@prisma/client"
import {Toast} from "next/dist/client/components/react-dev-overlay/internal/components/Toast";

const Shiften = () => {
  const context = api.useContext()
  const { mutate: removeSelectedStaffing } = api.staffing.removeStaffingAdmin.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
      })
    }
  })
  const { mutate: removeSelectedShift } = api.shift.removeShiftAdmin.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
      })
      ToastService.success("Shift is verwijderd")
    }
  })
  const { mutate: addStaffing } = api.staffing.addStaffing.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
      })
    }
  })
  const { mutate: changeTime } = api.shift.updateShiftStartAndEndTimes.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
      })
      ToastService.success("Tijden zijn veranderd")
    }
  })
  const { mutate: changeStaffRequired } = api.staffRequired.updateRequiredStaffingWithoutShiftTypeId.useMutation({
    onSuccess: () => {
      context.shift.getAllShifts.invalidate().catch((reason) => {
        console.log(reason)
      })
    }
  })

  const users: User[] = api.user.getUsersWithPreferencesAndStaffings.useQuery().data ?? []
  const employees: User[] = api.user.getUsersThatAreEmployees.useQuery().data
  const shifts = api.shift.getAllShifts.useQuery()
  const [unstaffedUsers, setUnstaffedUsers] = useState<User[]>([])
  const [unstaffedEmployees, setUnstaffedEmployees] = useState<User[]>([])
  const [staffedUsers, setStaffedUsers] = useState<User[]>([])
  const [expandedRow, setExpandedRow] = useState<null | string>(null)
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(null)
  const [dateValueStart, setDateValueStart] = useState<{start: DateValue, end: DateValue}>()
  const [dateValueEnd, setDateValueEnd] = useState<{start: DateValue, end: DateValue}>()
  const [staffingRequired, setStaffingRequired] = useState<number>(1);

  const [staffingList] = useAutoAnimate()

  useEffect(() => {
    if (expandedRow) {
      const shift = shifts.data?.find((shift) => shift.id === expandedRow)
      if (shift) {
        updateStaffedUsers(shift)
      }
    }
  }, [expandedRow, shifts.data])

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
      updateStaffedUsers(shift)
      setStaffingRequired(shift.staff_required[0].amount)
      console.log(shift.staff_required[0].amount)
    }
  }

  const getFormattedTimeShift = (shiftTime: DateTime) => {
    const dateTime = new Date(shiftTime)

    const year = dateTime.getFullYear()
    const month = String(dateTime.getMonth() + 1).padStart(2, "0")
    const day = String(dateTime.getDate()).padStart(2, "0")
    const hours = String(dateTime.getHours()).padStart(2, "0")
    const minutes = String(dateTime.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleChangeTime = (shift: ShiftWithStaffings) => {
    const newStartTime: Date = new Date(dateValueStart)
    const newEndTime: Date = new Date(dateValueEnd)
    const shiftId: string = shift.id

    if (newStartTime < new Date()) {
      ToastService.error("De begintijd moet na de huidige datum zijn")
      return
    }
    if ((newStartTime.getDay() != newEndTime.getDay())) {
      ToastService.error("De begin- en endtijd moeten op dezelfde dag vallen")
      return
    }
    if (newStartTime < newEndTime) {
      changeTime({ id: shiftId, startTime: newStartTime, endTime: newEndTime })
    } else {
      ToastService.error("De begintijd moet voor de eindtijd zijn")
    }
  }

  const handleStaffingChange = (shift: ShiftWithStaffings, plusOrMinus: string) => {
    let newStaffingRequired: number
    if (plusOrMinus === "plus") {
      newStaffingRequired = staffingRequired + 1
    } else if (plusOrMinus === "minus" && staffingRequired > 0) {
      newStaffingRequired = staffingRequired - 1
    } else if (plusOrMinus === "minus" && staffingRequired === 0) {
      ToastService.error("Dit getal kan niet onder 0 komen")
      return
    }
    setStaffingRequired(newStaffingRequired)
  }

  const handleConfirmStaffingCharge = (shift: ShiftWithStaffings) => {
    changeStaffRequired({id: shift.staff_required[0].id, staffRequired: staffingRequired})
  }

  const updateUnstaffedUsers = (updatedStaffedUsers: User[]) => {
    const updatedUnstaffedUsers: User[] = users.filter((user: User) => {
      return !updatedStaffedUsers.some((staffedUser: User) => staffedUser.id === user.id)
    })
    setUnstaffedUsers(updatedUnstaffedUsers)
  }

  const updateUnstaffedEmployees = (updatedStaffedEmployees: User[]) => {
    const updatedUnstaffedEmployees: User[] = employees.filter((user: User) => {
      return !updatedStaffedEmployees.some((staffedUser: User) => staffedUser.id === user.id)
    })
    setUnstaffedEmployees(updatedUnstaffedEmployees)
  }

  const updateStaffedUsers = (shift: ShiftWithStaffings) => {
    const updatedStaffedUsers: User[] = []
    shift.staffings?.forEach((staffing) => {
      if (staffing?.user) {
        updatedStaffedUsers.push(staffing.user)
      }
    })

    setStaffedUsers(updatedStaffedUsers)
    updateUnstaffedUsers(updatedStaffedUsers)
    updateUnstaffedEmployees(updatedStaffedUsers)
  }

  const handleRemoveStaffing = async (shift: ShiftWithStaffings, staffingId: string) => {
    try {
      await removeSelectedStaffing({ staffing_id: staffingId })
      updateStaffedUsers(shift)
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

  const handleAddStaffing = (shift: ShiftWithStaffings, shift_type: string) => {
    const spanContent = document.getElementById(shift_type)?.textContent ?? ""
    users.forEach((user) => {
      if (spanContent === `${user.name} ${user.last_name}`) {
        const selectedUserId: string = user.id
        try {
          addStaffing({ shift_type_name: shift_type, user_id: selectedUserId, shift_id: shift.id })
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  const handleSelectShiftType = () => {
    const shiftType = document.getElementById("shiftType")?.textContent ?? ""

    setSelectedShiftType(shiftType)
  }

  return (
    <div className="mb-20">
      <div className="flex justify-between items-center p-4 mb-4">
        <h1 className="text-xl font-bold mx-auto">Shiften</h1>
      </div>
      <div className="flex justify-center items-center">
        <table className="w-full md:max-w-2xl divide-y divide-gray-200 border-2 border-black">
          {/* Table headers */}
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
          {/* Shift displayed as row in table */}
          {shifts.data?.map((shift) => (
            <React.Fragment key={shift.id}>
              {expandedRow !== shift.id && (
                <tr
                  className="hover:bg-gray-200 cursor-pointer"
                  onClick={() => expandRow(shift)}
                >
                  {/* Shift date*/}
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div
                      className="text-sm text-gray-900">{shift.start.toString().slice(8, 10)} {shift.start.toString().slice(3, 7)} {shift.start.toString().slice(11, 15)}
                    </div>
                  </td>
                  {/* Shift time start to time end */}
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div className="text-sm text-gray-900">
                      {shift.start.toString().slice(16, 21)} tot {shift.end.toString().slice(16, 21)}
                    </div>
                  </td>
                  {/* Shift staffings */}
                  <td className="px-6 py-4 whitespace-nowrap border-2 border-black">
                    <div className="text-sm text-gray-900">
                      {shift.staffings.map((staffing) => (
                        <div key={staffing.id}>{staffing.user.name} {staffing.user.last_name}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Expanded shift */}
              {(expandedRow === shift.id) && (
                <tr>
                  <td colSpan={3}>
                    <div className="p-4 relative">
                      <div className="flex flex-col justify-between mb-4">
                        {/* Change shift time */}
                        <div className="flex flex-col mx-auto mb-2">
                          <div className="mb-2 font-bold text-center">Starttijd</div>
                          <div className="flex justify-between items-center max-w-xs mb-4">
                            <div className="flex-grow">
                              <div className="border-b-2 border-l-2 border-t-2 border-black p-4 text-center">
                                <DatetimeField
                                    // hacky way around the label requirement, any visible label would break styling
                                    label=" "
                                    id="start"
                                    defaultValue={parseDateTime(getFormattedTimeShift(shift.start))}
                                    onChange={(v) => { setDateValueStart(v) }}
                                ></DatetimeField>
                              </div>
                            </div>
                            <div className="w-30">
                              <Button onPress={() => handleChangeTime(shift)} aria-label="Wijzig starttijd" title="Wijzig starttijd" color="gray">
                                <Edit size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mb-2 font-bold text-center">Eindtijd</div>
                          <div className="flex justify-between items-center max-w-xs mb-2">
                            <div className="flex-grow">
                              <div className="border-b-2 border-l-2 border-t-2 border-black p-4 text-center">
                                <DatetimeField
                                    label=" "
                                    id="end"
                                    defaultValue={parseDateTime(getFormattedTimeShift(shift.end))}
                                    onChange={(v) => { setDateValueEnd(v) }}
                                ></DatetimeField>
                              </div>
                            </div>
                            <div className="w-30">
                              <Button onPress={() => handleChangeTime(shift)} aria-label="Wijzig eindtijd" title="Wijzig eindtijd" color="gray">
                                <Edit size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {/* Required staffing */}
                        <div className="mb-2 font-bold text-center">Benodigde vrijwilligers</div>
                        <div className="flex flex-row items-center mx-auto">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                                type="button"
                                onClick={() => handleStaffingChange(shift, "minus")}
                                className="rounded-l-lg px-4 py-2 bg-gray-200 text-gray-700 text-3xl focus:outline-none h-full">-</button>
                            <input
                                type="text"
                                id="staffRequired"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={staffingRequired}
                                placeholder="0"
                                className="w-16 px-4 py-2 bg-white text-gray-700 text-xl focus:outline-none text-center cursor-auto"
                                readOnly/>
                            <button
                                type="button"
                                onClick={() => handleStaffingChange(shift, "plus")}
                                className="rounded-r-lg px-4 py-2 bg-gray-200 text-gray-700 text-3xl focus:outline-none h-full">+</button>
                          </div>
                          <div className="ml-4">
                            <Button
                                onPress={() => handleConfirmStaffingCharge(shift)}
                                aria-label="Wijzig benodigd aantal vrijwilligers"
                                title="Wijzig benodigd aantal vrijwilligers"
                                color="gray">
                              <CheckSquare size="24" className="stroke-5/4" />
                            </Button>
                          </div>
                        </div>
                        {/* Minimise and delete buttons */}
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
                      {/* Displayed staffing "balie" */}
                      <div className="flex flex-col max-w-xs mx-auto" ref={staffingList}>
                        <p className="mb-4 font-bold text-center">Staffing Balie</p>
                        {shift.staffings.map((staffing) =>
                            staffing.shift_type.name === "Balie" ? (
                          <div key={staffing.id} className="flex items-center mb-2">
                            <div className="flex-grow">
                              <p className="border-b-2 border-l-2 border-t-2 border-black p-4">{staffing.user.name} {staffing.user.last_name}</p>
                            </div>
                            <div>
                              <Button
                                aria-label="Verwijder"
                                title="Verwijder"
                                color="red"
                                onPress={() => handleRemoveStaffing(shift, staffing.id)}>
                                <Trash2 size="24" className="stroke-5/4" />
                              </Button>
                            </div>
                          </div>
                        ) : null
                        )}
                      </div>
                      {/* Displayed staffing "galerie" */}
                      <div className="flex flex-col max-w-xs mx-auto" ref={staffingList}>
                        <p className="mb-4 mt-4 font-bold text-center">Staffing Galerie</p>
                        {shift.staffings.map((staffing) =>
                            staffing.shift_type.name === "Galerie" ? (
                            <div key={staffing.id} className="flex items-center mb-2">
                              <div className="flex-grow">
                                <p className="border-b-2 border-l-2 border-t-2 border-black p-4">{staffing.user.name} {staffing.user.last_name}</p>
                              </div>
                              <div>
                                <Button
                                    aria-label="Verwijder"
                                    title="Verwijder"
                                    color="red"
                                    onPress={() => handleRemoveStaffing(shift, staffing.id)}>
                                  <Trash2 size="24" className="stroke-5/4" />
                                </Button>
                              </div>
                            </div>
                            ) : null
                        )}
                      </div>
                      {/* Shift type selector */}
                      <div>
                        {/*TODO: onFocusChange is unintuitive, need to click on another element for method to be called*/}
                        <Select label="Shift Type" id="shiftType" initialText="Kies een shift type" onFocusChange={handleSelectShiftType}>
                          <Item value="Balie">Balie</Item>
                          <Item value="Galerie">Galerie</Item>
                        </Select>
                        {/* Select a staffing for balie */}
                        {selectedShiftType === 'Balie' && (
                            <>
                              <div className="mb-4">
                                <Select label="Balievrijwilligers" id={"Balie"} initialText="Kies een vrijwilliger">
                                  {unstaffedUsers.map((user) => (
                                      <Item key={user.name + user.last_name}>{user.name + " " + user.last_name}</Item>
                                  ))}
                                </Select>
                              </div>
                              <Button onPress={() => handleAddStaffing(shift, "Balie")} color="teal">
                                Voeg balie staffing toe
                              </Button>
                            </>
                        )}
                        {/* Select a staffing for galerie*/}
                        {selectedShiftType === 'Galerie' && (
                            <>
                              <div className="mb-4">
                                <Select label="Galeriemedewerkers en -vrijwilligers" id={"Galerie"} initialText="Kies een medewerker of vrijwilliger" items={employees}>
                                  {unstaffedEmployees.map((user) => (
                                      <Item key={user.name + user.last_name}>{user.name + " " + user.last_name}</Item>
                                  ))}
                                </Select>
                              </div>
                              <Button onPress={() => handleAddStaffing(shift, "Galerie")} color="teal">
                                Voeg galerie staffing toe
                              </Button>
                            </>
                        )}
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

export default Shiften
