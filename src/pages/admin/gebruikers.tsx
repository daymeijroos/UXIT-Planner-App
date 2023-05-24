import React from 'react';
import { api } from '../../utils/api';
import { User } from "@prisma/client";

const Gebruikers = () => {
  const users = api.user.getAllUsers.useQuery();

  if (users.isLoading) {
    return <div>loading...</div>;
  }

  if (users.error) {
    return <div>{users.error.message}</div>;
  }


  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gebruikers</h1>
        <p className="text-sm text-gray-500">{users.data?.length} Users</p>
      </div>
      <div className="flex justify-center items-center">
        <table className="w-full md:max-w-2xl divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Achternaam
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Voornaam
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {
            users.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-200 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.last_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.first_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Gebruikers;
