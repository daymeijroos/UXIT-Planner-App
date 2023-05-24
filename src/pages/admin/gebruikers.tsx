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


  return(
    <div>
      {
        users.data?.map((user) => {
          return (
            <h1>{user.last_name}, {user.first_name} - {user.email}</h1>
          )
        })
      }
    </div>
  );
}

export default Gebruikers;
