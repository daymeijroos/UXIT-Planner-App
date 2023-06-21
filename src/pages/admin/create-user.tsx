import React, { type FormEvent} from "react";
import { Button, NavigationBar, TextField, ToastService } from "../../components";
import { api } from "../../utils/api"
import { errorToast } from "../../components/elements/generic/toast/errorToast";

export default function CreateUser() {
  const {mutate: createUserBackend} = api.user.create.useMutation({
    onSuccess: () => {
      ToastService.success("Gebruiker is aangemaakt");
    },
    onError: () => {
      ToastService.error("Er is een fout opgetreden")
    }
  })

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      firstName: { value: string },
      lastName: { value: string },
      email: { value: string },
    }
    const firstName = target.firstName.value
    const lastName = target.lastName.value
    const email = target.email.value

    if(!firstName && !lastName && !email) {
      errorToast("Vul alle velden in")
      return;
    }

    if(!firstName) {
      errorToast("Vul een voornaam in")
      return;
    }
    if(!lastName) {
      errorToast("Vul een achternaam in")
      return;
    }
    if(!email) {
      errorToast("Vul een email in")
      return;
    }

    const formData = {
      name: firstName,
      last_name: lastName,
      email: email,
    }
    createUserBackend(formData)
  };

  return (
    <div className="text-center pt-10 h-screen flex justify-center mx-auto">
      <form onSubmit={handleCreateUser}>
        <div className="m-5">
          <h1>Account aanmaken</h1>
            <span className="flex text-left w-full mb-2 pt-5">Voornaam</span>
            <TextField type="text" id="firstName" name="firstName" placeholder="Vul hier de voornaam in:" />
            <span className="flex text-left w-full mb-2 pt-5">Achternaam</span>
            <TextField type="text" id="lastName" name="lastName" placeholder="Vul hier de achternaam in:" />
            <span className="flex text-left w-full mb-2 pt-5">E-mail</span>
            <TextField type="text" id="email" name="email" placeholder="Vul hier de e-mail in:" />
          <div className="pt-5">
            <Button type="submit" color="teal">Account aanmaken</Button>
          </div>
        </div>
      </form>
      <NavigationBar />
    </div>
  );
}
