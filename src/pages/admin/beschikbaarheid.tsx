import React, { useState } from "react";
import { api } from "../../utils/api";
import { NavigationBar } from "../../components";

const UserPreferencesPopup = ({ user, onClose }) => {
  if (!user) {
    return null;
  }


  // Hier moet ik de user preferences ophalens

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/2 h-5/6 p-6 rounded shadow-lg flex flex-col dark:bg-gray-700">
        <h2 className="text-xl font-bold mb-6 text-center">Gebruiker voorkeuren</h2>
        <div className="flex-grow flex flex-col justify-end">
          <div className="px-4 py-2">
            {/* Voorkeuren hier */}
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




const Gebruikers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const users = api.user.getAllUsers.useQuery();

  if (users.isLoading) {
    return <div>loading...</div>;
  }

  if (users.error) {
    return <div>{users.error.message}</div>;
  }

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mx-auto">Gebruikers</h1>
        <p className="text-sm">{users.data?.length} Gebruikers</p>
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
          {users.data?.map((user) => (
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
  );
};

export default Gebruikers;
