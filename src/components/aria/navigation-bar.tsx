import React from 'react';
import { Bell, Calendar, User } from 'react-feather';
import { useRouter } from 'next/navigation';
import { Button } from "./button"

export const NavigationBar = () => {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 bg-gray-0 text-black py-3 px-6 flex items-center w-screen justify-center space-x-4">
      <Button>
        <Bell className='stroke-1' color='#000' size="24"  width="30" height="30" />
      </Button>
      <Button color='success' onPress={() => router.push(
        '/'
        )}>
        <Calendar className='stroke-1'  color='#000' size="24" width="30" height="30"/>
      </Button>
      <Button>
        <User className='stroke-1' color='#000' size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};

