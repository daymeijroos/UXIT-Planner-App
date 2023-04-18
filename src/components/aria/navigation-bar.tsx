import React from 'react';
import { Bell, Calendar, User } from 'react-feather';
import { useRouter } from 'next/navigation';
import { Button } from "./button"
import { api } from '../../utils/api';

export const NavigationBar = () => {
  const context = api.useContext();
  const {mutate: removeStaffings} = api.staffing.removeAllStaffing.useMutation({onSuccess: () => {
    context.staffing.getStaffing.invalidate({from: new Date(new Date('2023-04-18T00:00:00Z').setHours(0, 0, 0, 0))}).catch((error) => {
      console.error(error);
    });
    context.schedule.getUnfulfilledShifts.invalidate().catch((error) => {
      console.error(error);
    });
  }});

  const router = useRouter();
  return (
    <nav className="fixed bottom-0 bg-gray-0 text-black py-3 px-6 flex items-center w-screen justify-center space-x-4">
      <Button onPress={() => {removeStaffings()}}>
        <Bell className='stroke-1' color='#000' size="24"  width="30" height="30" />
      </Button>
      <Button color='success' onPress={() => router.push('/')}>
        <Calendar className='stroke-1'  color='#000' size="24" width="30" height="30"/>
      </Button>
      <Button onPress={() => router.push('/testGenerate')}>
        <User className='stroke-1' color='#000' size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};

