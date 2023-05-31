import React from 'react';
import { api } from '../../utils/api';
import { NavigationBar } from "../../components";

const Gebruikers = () => {
  const users = api.user.getAllUsers.useQuery();

  if (users.isLoading) {
    return <div>loading...</div>;
  }

  if (users.error) {
    return <div>{users.error.message}</div>;
  }

  const handleUserClick = (userId) => {
    console.log(userId);
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Voornaam
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Achternaam
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black">
              Email
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {
            users.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleUserClick(user.id)}>
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
            ))
          }
          </tbody>
        </table>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Gebruikers;
