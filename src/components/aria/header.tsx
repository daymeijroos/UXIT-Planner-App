import React from 'react';
import { Bell, Calendar, User } from 'react-feather';
import { useRouter } from 'next/navigation';
// import button.tsx
import {Button} from "./button"

const header = () => {
  const router = useRouter();
  const weekday = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  return (
    <nav className="fixed bottom-0 bg-gray-0 text-black py-3 px-6 flex justify-around items-center w-screen">
      <Button  onPress={() => router.push('/notifications')} >
        <Bell className='stroke-1' color='#000' size="24"  width="30" height="30" />
      </Button>
      <Button color='success' onPress={() => router.push(
        '/rooster/'+ weekday[new Date().getDay()]
        )}>
        <Calendar className='stroke-1'  color='#000' size="24" width="30" height="30"/>
      </Button>
      <Button  onPress={() => router.push('/account')} >
        <User className='stroke-1' color='#000' size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};
export default header;

