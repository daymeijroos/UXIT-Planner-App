import React, { useState } from "react";
import { api } from "../../utils/api";
import { Button, NavigationBar, TextField, ToastService } from "../../components";
import type { Role, User } from "@prisma/client";
import { Item} from "../../components/atoms/input/Selector";
import { RolSelect } from "../../components/atoms/input/rol-selector";



const ModifyUserPopup = ({ user, onClose: close }: { user: User, onClose: () => void }) => {
  const apiContext = api.useContext();
  const [selectedName, setSelectedName] = useState<string>(user.name ?? "");
  const [selectedLastname, setSelectedLastname] = useState<string>(user.last_name ?? "");
  const [selectedEmail, setSelectedEmail] = useState<string>(user.email ?? "");
  const [selectedRole, setSelectedRole] = useState<string>(user.role_name ?? "");
  const { data: rolesData}: { data: Role[] | undefined, isLoading: boolean } = api.role.getAll.useQuery();

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

  const handleModifySubmit = () => {
    const firstName = selectedName
    const lastName = selectedLastname
    const email = selectedEmail === "" ? undefined : selectedEmail
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
            <div className="flex flex-col items-stretch gap-4">
              <h1 className="mb-4 text-center">Account wijzigen</h1>
              <TextField type="text" label="Voornaam" id="firstName" name="firstName" placeholder={"John"} value={selectedName} onChange={(event) => setSelectedName(event)}/>
              <TextField type="text" label="Achternaam" id="lastName" name="lastName" placeholder={"Deere"} value={selectedLastname} onChange={(event) => setSelectedLastname(event)}/>
              <TextField type="text" label="E-mail" id="email" name="email" placeholder={"John@deere.nl"} value={selectedEmail} onChange={(event) => setSelectedEmail(event)}/>
              {<RolSelect label="Role" id="role" placeholder="Kies een rol" items={rolesData ?? []} selectedKey={selectedRole} onSelectionChange={(key: any) => {if (typeof key === "string") setSelectedRole(key)}}>
                {(role : Role) => <Item key={role.name}>{role.name}</Item>}
              </RolSelect>}
              <div className={"mt-4"}>
              <Button onClick={handleModifySubmit} type="button" color="teal">
                Account wijzigen
              </Button>
              </div>
            </div>
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
          <table className="w-full divide-y divide-gray-200 border-2 border-black mb-[100px]">
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
