import Head from "next/head"
import { Button, NavigationBar, LoadingMessage } from "../../components"
import { api } from "../../utils/api"
import { ToastService } from "../../components"

export default function Admin() {
  const { mutateAsync: generateSchedule } = api.schedule.generate.useMutation({
    onSuccess: () => {
      ToastService.success("Het is gelukt!")
      context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
        console.error(error)
      })
    }, onError: (error) => {
      ToastService.error(error.message)
    }
  })
  const unfulfilledShifts = api.schedule.getUnfulfilledShifts.useQuery()
  const context = api.useContext()

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
      <div className="flex flex-col items-center justify-center dark:bg-[#2B303C]" >
        <h1 className="mt-4 text-3xl font-bold text-center">Admin paneel</h1>
        <h2 className="mt-4 text-xl font-bold text-center">Rooster</h2>
        <div className="flex-wrap justify-center mt-4 space-x-4 sm:flex max-sm:space-x-0">
          <Button color="success" onPress={() => {
            void generateSchedule({
              from: new Date(),
              to: new Date(new Date().setDate(new Date().getDate() + 7))
            })
          }} className="w-64">Genereer Rooster</Button>
          <Button color="error" onPress={() => { void removeStaffings() }} className="w-64 max-sm:mt-4">Verwijder Rooster</Button>
        </div>
        <div className="flex-wrap justify-center mt-4 space-x-4 sm:flex max-sm:space-x-0">
          <Button className="w-64">Handmatige aanpassingen</Button>
          <Button className="w-64 max-sm:mt-4">Openingsweekend aangeven</Button>
        </div>
        <div className="flex-col items-center justify-center m-4 space-y-4">
          <h2 className="text-xl font-bold text-center">Vrijwilligers</h2>
          <div className="flex-wrap justify-center mt-4 space-x-4 sm:flex max-sm:space-x-0">
            <Button className="w-64">Voorkeur aanpassen</Button>
            <Button className="w-64 max-sm:mt-4">Beschikbaarheid aanpassen</Button>
          </div>
          <div className="flex-wrap justify-center mt-4 space-x-4 sm:flex max-sm:space-x-0">
            <Button className="w-64">Werkuren aanpassen</Button>
            <Button className="w-64 max-sm:mt-4">Verlof aangeven</Button>
          </div>
          <Button className="w-64">Inwerken inroosteren</Button>
          <h2 className="mt-4 text-xl font-bold text-center">Uitbreiding</h2>
          <Button className="w-64">Nieuw shifttype toevoegen</Button>
          <h2 className="mt-4 text-xl font-bold text-center">Accounts beheren</h2>
          <div className="flex-wrap justify-center mt-4 space-x-4 sm:flex max-sm:space-x-0">
            <Button className="w-64">Account aanmaken</Button>
            <Button className="w-64 max-sm:mt-4 max-sm:mb-24">Rollenbeheer</Button>
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
        <NavigationBar />
      </div>
    </>
  )
}
