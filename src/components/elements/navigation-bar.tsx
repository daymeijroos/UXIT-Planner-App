import React from 'react';
import { Bell, Calendar, User } from 'react-feather';
import { useRouter } from 'next/navigation';
import { Button } from "../atoms/button"
import { api } from '../../utils/api';

export const NavigationBar = () => {


  const router = useRouter();
  return (
    <nav className="fixed bottom-0 bg-gray-0 text-black py-3 px-6 flex items-center w-screen justify-center space-x-4">
      <Button aria-label="Notificaties" title='Notificaties'>
        <Bell className='stroke-2' color='#000' size="24" width="30" height="30" />
      </Button>
      <Button color='success' onPress={() => router.push('/')} aria-label="Kalender" title='Kalender'>
        <Calendar className='stroke-2' color='#000' size="24" width="30" height="30" />
      </Button>
      <Button onPress={() => router.push('/admin')} aria-label="Account" title='Account'>
        <User className='stroke-2' color='#000' size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};

