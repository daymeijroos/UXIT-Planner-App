import React, { FormEvent, Key, useState } from "react";
import { api } from "../../utils/api";
import { Button, NavigationBar, TextField, ToastService } from "../../components";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";
import type { User } from  "@prisma/client";
import { errorToast } from "../../components/elements/generic/toast/errorToast";
import ModifyUser from "./modify-user";
import { Item, Select } from "../../components/atoms/input/Selector";



const ModifyUserPopup = ({ user, onClose: close }: { user: User, onClose: () => void }) => {
  const apiContext = api.useContext();
  const [selectedRole, setSelectedRole] = useState<string>(user.role_name);


  const { data: rolesData, isLoading: rolesLoading } = api.role.getAll.useQuery();

  const {mutate: modifyUserBackend} = api.user.update.useMutation({
    onSuccess: () => {
      ToastService.success("Gebruiker is aangepast");
      apiContext.user.getAll.invalidate()
        .catch(() => {
          ToastService.error("Er is een fout opgetreden")
        })
      close()
    },
    onError: () => {
      ToastService.error("Er is een fout opgetreden")
    }
  })

  const handleModifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      firstName: { value: string },
      lastName: { value: string },
      email: { value: string },
    }
    const firstName = target.firstName.value
    const lastName = target.lastName.value
    const email = target.email.value === "" ? undefined : target.email.value
    const role = selectedRole
    const userId : string = user.id


    const formData : {
      id: string,
      name: string,
      last_name: string,
      email: string | undefined
      role_name: string,
    }= {
      id: userId,
      name: firstName,
      last_name: lastName,
      email: email,
      role_name: role,
    }
      modifyUserBackend(formData)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full md:w-1/2 h-5/6 p-6 rounded shadow-lg flex flex-col dark:bg-gray-700">
        <div className="flex flex-col flex-grow justify-center items-center px-4 py-2">
          <div>
            <form onSubmit={handleModifySubmit} className="flex flex-col items-stretch gap-4">
              <h1 className="mb-4 text-center">Account wijzigen</h1>
              <TextField type="text" label="Voornaam" id="firstName" name="firstName" placeholder={"John"} />
              <TextField type="text" label="Achternaam" id="lastName" name="lastName" placeholder={"Deere"} />
              <TextField type="text" label="E-mail" id="email" name="email" placeholder={"John@deere.nl"} />
              <Select label="Role" id="role" name="role" placeholder={"Selecteer een rol"} selectedKey={selectedRole} onSelectionChange={(newRole: Key) => setSelectedRole(newRole as string)}>
                <>
                {!rolesLoading &&
                  rolesData?.map((role) => (
                    <Item key={role.name}>{role.name}</Item>
                  ))}
                </>
              </Select>
              <div className={"mt-4"}>
              <Button type="submit" color="teal">
                Account aanmaken
              </Button>
              </div>
            </form>
          </div>
        </div>
        <button
          onClick={close}>
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

  const handleRowClick = (user : User) => {
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
            {users.data?.map((user : User) => (
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
        {selectedUser && isPopupOpen && (
          <ModifyUserPopup user={selectedUser} onClose={() => setIsPopupOpen(false)} />
        )}
      </div>
      <NavigationBar/>
    </div>
  );
};

  export default Users;
