import React, { useEffect, useState } from "react"
import { api } from "../../utils/api"
import { NavigationBar } from "../../components"
import { UserWithPreferenceAndStaffings } from "../../../server/types/user"
import { Weekday } from "../../../prisma/weekday"
import { AvailabilityWithShiftTypes } from "../../../server/types/availibility"

const UserPreferencesPopup = ({ user, onClose }: { user: UserWithPreferenceAndStaffings }) => {
  const getDayName = (dayNumber: number) => {
    const weekdays = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"]
    return weekdays[dayNumber]
  }

  const sortedEvenAvailability: AvailabilityWithShiftTypes[] = user.preference.availability_even_week.availability?.sort((
    compareFirstElement: AvailabilityWithShiftTypes, compareSecondElement: AvailabilityWithShiftTypes) => {
    if (compareFirstElement.weekday === 0) return 1
    return compareFirstElement.weekday - compareSecondElement.weekday
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col w-1/2 p-6 bg-white rounded shadow-lg h-5/6 dark:bg-gray-700">
        <h2 className="mb-6 text-xl font-bold text-center">Gebruiker voorkeuren</h2>
        <div className="flex flex-col justify-end flex-grow">
          <div className="px-4 py-2">
            <div>
              <span className="font-bold">Voornaam: {user.name} </span>
              <span className="font-bold">Beschikbaarheid: {user.preference?.availability_even_week.id} </span>
              <div>
                {sortedEvenAvailability.map((availability) => (
                  <div key={availability.id}>
                    <span className="font-bold">Dag: {getDayName(availability.weekday)} </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Voorkeuren hier */}
          </div>
          <button
            className="self-center px-10 py-2 mt-6 mb-2 font-semibold text-gray-800 transition duration-300 ease-in-out bg-gray-300 rounded hover:bg-green-600"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-10 py-2 mt-6 mb-2 font-semibold text-gray-800 transition duration-300 ease-in-out bg-gray-300 rounded hover:bg-green-600"
            onClick={onClose}
          >
            Test
          </button>
        </div>
      </div>
    </div>
  )
}




const Gebruikers = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const users = api.user.getAllUserWithPreferences.useQuery()

  if (users.isLoading) {
    return <div>loading...</div>
  }

  if (users.error) {
    return <div>{users.error.message}</div>
  }

  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsPopupOpen(true)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="mx-auto text-xl font-bold">Gebruikers</h1>
        <p className="text-sm">{users.data?.length} Gebruikers</p>
      </div>
      <div className="flex items-center justify-center">
        <table className="w-full border-2 border-black divide-y divide-gray-200 md:max-w-2xl">
          <thead className="border-2 border-black bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium font-extrabold tracking-wider text-left text-black uppercase border-2 border-black dark:">
                Voornaam
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium font-extrabold tracking-wider text-left text-black uppercase border-2 border-black dark:">
                Achternaam
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium font-extrabold tracking-wider text-left text-black uppercase border-2 border-black dark:">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.data?.map((user) => (
              <tr key={user.id} className="cursor-pointer hover:bg-gray-200" onClick={() => handleRowClick(user)}>
                <td className="px-6 py-4 border border-black whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 border border-black whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.last_name}</div>
                </td>
                <td className="px-6 py-4 border border-black whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPopupOpen && <UserPreferencesPopup user={selectedUser} onClose={() => setIsPopupOpen(false)} />}
      <NavigationBar />
    </div>
  )
}

export default Gebruikers
