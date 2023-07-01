import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import {NavigationBar, Checkbox, Button, ToastService} from "../../components";
import { UserWithPreferenceAndStaffings } from "../../../server/types/user";
import { Weekday } from "../../../prisma/weekday";
import { AvailabilityWithShiftTypes } from "../../../server/types/availability";
import {AvailabilityEvenWeek, AvailabilityFlexible, AvailabilityOddWeek, User, User_Preference} from "@prisma/client";
import {useToggleState} from 'react-stately';
import {useCheckbox} from 'react-aria';

const UserPreferencesPopup = ({ user, onClose }: {user: UserWithPreferenceAndStaffings, onClose: () => void}) => {
  const getDayName = (dayNumber: number) => {
    const weekdays = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
    return weekdays[dayNumber];
  };


  const sortedEvenAvailability: AvailabilityEvenWeek[] = user.preference?.availability_even_week?.availability
  const sortedOddAvailability: AvailabilityOddWeek[] = user.preference?.availability_odd_week?.availability
  const sortedFlexibleAvailability: AvailabilityFlexible[] = user.preference?.availability_flexible?.availability

  let [selected, setSelection] = React.useState(false);



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-2/3 h-5/6 p-6 rounded shadow-lg flex flex-col dark:bg-gray-700">
        <h2 className="text-xl font-bold mb-6 text-center">{user.name}'s voorkeuren</h2>
        <div className="flex-grow flex flex-col justify-end">


            <AvailabilityEvenWeekForm user={user}/>
          <div>
            {sortedEvenAvailability?.map((availability) => (
                <div key={availability.id}>
                  <span className="font-bold">Dag even: {getDayName(availability.weekday)} </span>
                </div>
            ))}
          </div>
          <div>
            {sortedOddAvailability?.map((availability) => (
              <div key={availability.id}>
                <span className="font-bold">Dag oneven: {getDayName(availability.weekday)} </span>
              </div>
            ))}
          </div>
          <div>
            {sortedFlexibleAvailability?.map((availability) => (
              <div key={availability.id}>
                <span className="font-bold">Dag flexibel: {getDayName(availability.weekday)} </span>
              </div>
            ))}
          </div>

          <div className="px-4 py-2">
          </div>
          <button
            className="bg-gray-300 hover:bg-green-600 text-gray-800 font-semibold py-2 px-10 rounded self-center mt-6 mb-2 transition duration-300 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AvailabilityEvenWeekForm = ({ user }: { user: UserWithPreferenceAndStaffings }) => {
  const context = api.useContext();

  const { mutate } = api.availability.addDefaultAvailability.useMutation({
    onSuccess: () => {
      context.user.getUsersWithPreferencesAndStaffings
        .invalidate()
        .catch(() => {
          ToastService.error("Er is wat misgegaan");
        });
    },
  });

  const weekdays = [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
  ];

  function addDefaultAvailability(weekday: Weekday) {
    const availability = {
      weekday,
    };

    mutate(
      {
        preferenceId: user.user_preference_id,
        availability: [availability],
      },
      {
        onSuccess: () => {
          const updatedUser = { ...user };

          if (!updatedUser.preference.availability_even_week) {
            updatedUser.preference.availability_even_week = {
              availability: [],
            };
          }

          if (!updatedUser.preference.availability_odd_week) {
            updatedUser.preference.availability_odd_week = {
              availability: [],
            };
          }

          if (!updatedUser.preference.availability_flexible) {
            updatedUser.preference.availability_flexible = {
              availability: [],
            };
          }

          if (weekday === 1) {
            updatedUser.preference.availability_even_week.availability.push(availability)
          } else if (weekday === 0) {
            updatedUser.preference.availability_odd_week.availability.push(availability)
          } else if (weekday === 2) {
            updatedUser.preference.availability_flexible.availability.push(availability)
          }
        },
        onError: () => {
          ToastService.error("Er is iets misgegaan bij het toevoegen van beschikbaarheid.")
        },
      }
    );
  }

  const hasEvenWeekAvailability =
    user.preference?.availability_even_week?.availability?.length > 0

  const hasOddWeekAvailability =
    user.preference?.availability_odd_week?.availability?.length > 0

  const hasFlexibleAvailability =
    user.preference?.availability_flexible?.availability?.length > 0

  return (
    <form className="flex flex-wrap">
      {hasEvenWeekAvailability && (
        <div className="w-1/3">
          <h3 className="font-bold mb-2">Even Week</h3>
          {weekdays.map((day, index) => {
            const isSelected = user.preference?.availability_even_week?.availability?.some(
              (availability) => availability.weekday === index
            );

            return (
              <div key={index} className="flex items-center mb-4">
                <Checkbox
                  id={`even-week-${day}`}
                  value={day}
                  isSelected={isSelected}
                  onChange={() => {}}
                  aria-label={`even-week-${day}`}
                />
                <label htmlFor={`even-week-${day}`} className="ml-2">
                  {day} (even week vast)
                </label>
              </div>
            );
          })}
        </div>
      )}

      {!hasEvenWeekAvailability && (
        <div className="w-1/3">
          <div className="mr-4">
            <Button onPress={() => addDefaultAvailability(1)}>
              Voeg vaste beschikbaarheid toe voor even weken
            </Button>
          </div>
        </div>
      )}

      {hasOddWeekAvailability && (
        <div className="w-1/3">
          <h3 className="font-bold mb-2">Oneven Week</h3>
          {weekdays.map((day, index) => {
            const isSelected = user.preference.availability_odd_week.availability.some(
              (availability) => availability.weekday === index
            );

            return (
              <div key={index} className="flex items-center mb-4">
                <Checkbox
                  id={`odd-week-${day}`}
                  value={day}
                  isSelected={isSelected}
                  onChange={() => {}}
                  aria-label={`odd-week-${day}`}
                />
                <label htmlFor={`odd-week-${day}`} className="ml-2">
                  {day} (oneven week vast)
                </label>
              </div>
            );
          })}
        </div>
      )}

      {!hasOddWeekAvailability && (
        <div className="w-1/3">
          <div className="mr-4 ml-4">
            <Button onPress={() => addDefaultAvailability(0)}>
              Voeg vaste beschikbaarheid toe voor oneven weken
            </Button>
          </div>
        </div>
      )}

      {hasFlexibleAvailability && user.preference?.availability_flexible && (
        <div className="w-1/3">
          <h3 className="font-bold mb-2">Flexibel</h3>
          {weekdays.map((day, index) => {
            const isSelected = user.preference.availability_flexible.availability?.some(
              (availability) => availability.weekday === index
            );

            return (
              <div key={index} className="flex items-center mb-4">
                <Checkbox
                  id={`flexible-${day}`}
                  value={day}
                  isSelected={isSelected}
                  onChange={() => {}}
                  aria-label={`flexible-week-${day}`}
                />
                <label htmlFor={`flexible-${day}`} className="ml-2">
                  {day} (flexibel)
                </label>
              </div>
            );
          })}
        </div>
      )}

      {!hasFlexibleAvailability && (
        <div className="w-1/3">
          <div className="ml-2">
            <Button onPress={() => addDefaultAvailability(2)}>
              Voeg flexibele beschikbaarheid toe
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};




const Gebruikers = () => {
  const [selectedUser, setSelectedUser] = useState<UserWithPreferenceAndStaffings | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const usersQuery = api.user.getUsersWithPreferencesAndStaffings.useQuery()

  if (usersQuery.isLoading) {
    return <div>loading...</div>
  }

  if (usersQuery.error) {
    return <div>{usersQuery.error.message}</div>
  }

  const users: UserWithPreferenceAndStaffings[] = usersQuery.data

  const handleRowClick = (user: UserWithPreferenceAndStaffings) => {
    setSelectedUser(user)
    setIsPopupOpen(true)
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mx-auto">Voorkeuren aanpassen</h1>
        <p className="text-sm">{users.length} Gebruikers</p>
      </div>
      <div className="flex justify-center items-center">
        <table className="w-full md:max-w-2xl divide-y divide-gray-200 border-2 border-black">
          <thead className="bg-gray-50 border-2 border-black">
          <tr>
            <th scope="col" className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark: text-black">
              Voornaam
            </th>
            <th scope="col" className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark: text-black">
              Achternaam
            </th>
            <th scope="col" className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark: text-black">
              Email
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleRowClick(user)}>
              <td className="px-6 py-4 whitespace-nowrap border border-black">
                <div className="text-sm text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border border-black">
                <div className="text-sm text-gray-900">{user.last_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border border-black">
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
