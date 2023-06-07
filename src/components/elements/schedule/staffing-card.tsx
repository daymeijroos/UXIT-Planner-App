import { api } from "../../../utils/api"
import { type FormEvent, useState } from "react"
import { useSession } from "next-auth/react"

import type { StaffingWithColleagues } from "../../../types/StaffingWithColleagues"
import { formatDate } from "../../../utils/date/formatDate"
import { formatTime } from "../../../utils/date/formatTime"
import { formatShiftStaffList } from "../../../utils/formatShiftStaffList"
import { Button, Card, TextField } from "../../atoms"
import { errorToast } from "../generic/toast/errorToast"
import React from 'react'

interface StaffingCardProps {
  staffing: StaffingWithColleagues
}



export function StaffingCard(props: StaffingCardProps) {
  // const shift_type_id = api.requiredStaffing.getReserveShiftType.useQuery();

  const { data: sessionData } = useSession()
  const userName = sessionData?.user?.name
  const [showForm, setShowForm] = useState(false)

  const determineShowButton = (staffing: StaffingWithColleagues): boolean => {
    let result = false
    staffing.shift.staffings.forEach((nestedStaffing) => {
      if (nestedStaffing.user.name == userName) {
        result = true
      }
    })

    return result
  }


  const handleButtonClick = () => {
    setShowForm(true)
  }

  const context = api.useContext()


  const { mutate: handleCheckOut } = api.absence.checkOut.useMutation({
    onSuccess: () => {
      context.staffing.getStaffing.invalidate().catch((error) => {
        throw error
      })
    }
  })

  const handleFormAndStaffingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      reasonForAbsence: { value: string }
    }
    const reason = target.reasonForAbsence.value
    const formData = {
      shift_id: props.staffing.shift.id,
      reason: reason,
    }

    Promise.all([
      handleCheckOut(formData)

    ]).catch(() => {
      errorToast("There has been an error")
    })
  }



  return (
    <Card>
      <h1 className="text-2xl font-bold">
        {
          `${formatTime(props.staffing.shift.start)}-${formatTime(props.staffing.shift.end)}`
        }
      </h1>
      <p>
        {
          `${formatDate(props.staffing.shift.start)[0].toUpperCase()}${formatDate(props.staffing.shift.start).slice(1)}`
        }
      </p>
      <br />
      <p>
        {
          formatShiftStaffList(props.staffing)
        }
      </p>
      {determineShowButton(props.staffing) && !showForm && (
        <Button onPress={handleButtonClick}>Afmelden</Button>
      )}
      {showForm && (<form onSubmit={handleFormAndStaffingSubmit}>
        <TextField type="text" id="reasonForAbsence" name="reasonForAbsence" placeholder="Vul hier uw reden in:" />
        <Button type="submit" id="reason" name="reason" >Submit</Button>
      </form>
      )}
    </Card>
  )
}
