import React, { useState } from 'react';
import {Button} from "./button";
import {TextField} from "./text-field";

export function FormPreset() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleFirstNameChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: value
    }) as typeof formData);
  };

  const handleLastNameChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      lastName: value
    }) as typeof formData);
  };

  const handleEmailChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: value
    }) as typeof formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Form is valid, submit data or perform other actions
      console.log(formData);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName) {
      errors.firstName = 'Vul uw voornaam in';
    }

    if (!formData.lastName) {
      errors.lastName = 'Vul uw achternaam in';
    }

    if (!formData.email) {
      errors.email = 'Vul uw e-mail in';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Vul een geldige e-mail in';
    }

    return errors;
  };

  const isValidEmail = (email: string) => {
    // Add your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Inwerken vrijwilliger</h1>
        <form onSubmit={handleSubmit}>
          <TextField label="Voornaam" error={formErrors.firstName} onChange={handleFirstNameChange} placeholder="Jan"></TextField>
          <TextField label="Achternaam" error={formErrors.lastName} onChange={handleLastNameChange} placeholder="Jansen"></TextField>
          <TextField label="E-mail" type= "email" error={formErrors.email} onChange={handleEmailChange} placeholder="voorbeeld@voorbeeld.com"></TextField>
        <Button type="submit">Indienen</Button>
      </form>
      </div>
  );
}
