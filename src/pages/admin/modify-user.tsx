import React, { FormEvent, useState } from "react";
import { api } from "../../utils/api";
import { Button, NavigationBar, TextField } from "../../components";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";
import type { User } from  "@prisma/client";
import { errorToast } from "../../components/elements/generic/toast/errorToast";
import ModifyUser from "./modify-user";
import { Item, Select } from "../../components/atoms/input/Selector";

const ModifyUserPopup = ({ user, onClose }: { user: User | null, onClose: () => void }) => {
  if (!user) {
    return null;
  }

  const { data: rolesData, isLoading: rolesLoading } = api.role.getAll.useQuery();
  const {mutate: modifyUserBackend} = api.user.update.useMutation({})

  const handleModifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      firstName: { value: string },
      lastName: { value: string },
      email: { value: string },
      role: { value: string },
    }
    const firstName = target.firstName.value
    const lastName = target.lastName.value
    const email = target.email.value
    const role = target.role.value
    const userId : string = user.id

    const formData = {
      id: userId,
      name: firstName,
      last_name: lastName,
      email: email,
      role: role,
    }

    Promise.all([
      modifyUserBackend(formData),
      onClose()

    ]).catch(() => {
      errorToast("There has been an error")
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full md:w-1/2 h-5/6 p-6 rounded shadow-lg flex flex-col dark:bg-gray-700">
        <h2 className="text-xl font-bold mb-6 text-center">Gebruiker Gegevens Wijzigen</h2>
        <div className="flex flex-col flex-grow justify-center items-center px-4 py-2">
          <div>
            <form onSubmit={handleModifySubmit} className="flex flex-col items-stretch">
              <h1 className="mb-4 text-center">Account aanmaken</h1>
              <span className="flex text-left w-full mb-2">Voornaam</span>
              <TextField type="text" id="firstName" name="firstName" placeholder={user.name} />
              <span className="flex text-left w-full mb-2">Achternaam</span>
              <TextField type="text" id="lastName" name="lastName" placeholder={user.last_name} />
              <span className="flex text-left w-full mb-2">E-mail</span>
              <TextField type="text" id="email" name="email" placeholder={user.email} />
                                                                                                                                                                                                                                                                                                        <Select label="Role" id="role" name="role" placeholder={user.role_name}>
                {!rolesLoading &&
                  rolesData?.map((role) => (
                    <Item key={role.name}>{role.name}</Item>
                  ))}
              </Select>
              <Button type="submit" color="teal" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded mt-4">
                Account aanmaken
              </Button>
            </form>
          </div>
        </div>
        <button
          className="bg-gray-300 hover:bg-green-600 text-gray-800 font-semibold py-2 px-10 rounded self-center mt-6 mb-2 transition duration-300 ease-in-out"
          onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};




const Users = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const users = api.user.getAll.useQuery();

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
    <div className="p-4 flex justify-center items-center md:items-start">
      <div className="w-full md:max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-center md:text-left">Gebruikers</h1>
          <p className="text-sm">{users.data?.length} Gebruikers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border-2 border-black">
            <thead className="bg-gray-50 border-2 border-black">
            <tr>
              <th
                scope="col"
                className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark:text-black"
              >
                Voornaam
              </th>
              <th
                scope="col"
                className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark:text-black"
              >
                Achternaam
              </th>
              <th
                scope="col"
                className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark:text-black"
              >
                Email
              </th>
              <th
                scope="col"
                className="font-extrabold px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-2 border-black dark:text-black"
              >
                Role
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {users.data?.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleRowClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{user.last_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border border-black">
                  <div className="text-sm text-gray-900">{user.role_name}</div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        {isPopupOpen && (
          <ModifyUserPopup user={selectedUser} onClose={() => setIsPopupOpen(false)} />
        )}
      </div>
      <NavigationBar/>
    </div>
  );
};

  export default Users;
