import Head from "next/head"
import { Button, NavigationBar, LoadingMessage } from "../../components"
import { api } from "../../utils/api"
import { ToastService } from "../../components"
import React from 'react'
import { useRouter } from "next/router"
import { Calendar } from "react-feather"

export default function Admin() {
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery()
  const context = api.useContext()
  const router = useRouter()

  const { mutate: removeStaffings } = api.staffing.removeAllStaffing.useMutation({
    onSuccess: () => {
      ToastService.success("Het is gelukt!")
      context.staffing.getStaffing.invalidate({ fromDate: new Date(new Date("2023-04-18T00:00:00Z").setHours(0, 0, 0, 0)) }).catch((error) => {
        console.error(error)
      })
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error)
      })
    }, onError: (error) => {
      ToastService.error(error.message)
    }
  })

  if (unfulfilledShifts.isLoading || status === "loading") {
    return <LoadingMessage />
  }

  if (unfulfilledShifts.error) {
    return <div>{unfulfilledShifts.error.message}</div>
  }

  return (
    <>
      <Head>
        <title>Home | Pulchri Planner</title>
      </Head>
      <div className="flex flex-col items-center gap-5 pt-8">
        <h1>Admin paneel</h1>
        <div className="flex flex-col w-full max-w-screen-md gap-4">
          <h2>Rooster</h2>
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="col-span-2">
              <Button color="teal" onPress={() => {
                router.push("/admin/genereer-rooster")
              }}>
                <h4>Genereer Rooster</h4>
                <Calendar size="24" className="ml-2 stroke-2" />
              </Button>
            </div>
            <Button>Handmatige aanpassingen</Button>
            <Button>Openingsweekend aangeven</Button>
          </div>
          <h2>Vrijwilligers</h2>
          <div className="grid w-full grid-cols-2 gap-4">
            <Button>Voorkeur aanpassen</Button>
            <Button>Beschikbaarheid aanpassen</Button>
            <Button>Werkuren aanpassen</Button>
            <Button>Verlof aangeven</Button>
            <Button>Inwerken inroosteren</Button>
          </div>
          <h2>Uitbreiding</h2>
          <div className="grid w-full grid-cols-2 gap-4">
            <Button>Nieuw shifttype toevoegen</Button>
          </div>
          <h2>Accounts beheren</h2>
          <div className="grid w-full grid-cols-2 gap-4">
            <Button>Account aanmaken</Button>
            <Button>Rollenbeheer</Button>
          </div>
        </div>
        {unfulfilledShifts.data?.map((request) => {
          const requestResolved = request
          return (
            <div key={requestResolved?.shift_id}>
              <p>Shift ID: {requestResolved?.shift_id}</p>
              <p>Shift type: {requestResolved?.shift_type_id}</p>
              <p>Amount required: {requestResolved?.amount_required}</p>
              <p>Amount staffed: {requestResolved?.amount_staffed}</p>
            </div>
          )
        })}
      </div >
      <NavigationBar />
    </>
  )
}
