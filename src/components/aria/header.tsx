import React from 'react';
import { Bell, Calendar, User } from 'react-feather';
import { useRouter } from 'next/navigation';

const header = () => {
  const router = useRouter();
  return (
    <nav className="bg-gray-200 text-black py-3 px-6 flex justify-between items-center">
      <button className="headerNavButton text-lg font-medium border-1-black border border-indigo-600" type="button" onClick={() => router.push('/notifications')} >
        <Bell className='stroke-1' color='#000' size="24"  width="30" height="30" />
      </button>
      <button className="headerNavButton text-lg font-medium border border-indigo-600" type="button" onClick={() => router.push('/rooster')}>
        <Calendar className='stroke-1'  color='#000' size="24" width="30" height="30"/>
      </button>
      <button className="headerNavButton text-lg font-medium border border-indigo-600" type="button" onClick={() => router.push('/account')}>
        <User className='stroke-1' color='#000' size="24" width="30" height="30" />
      </button>
    </nav>
  );
};

export default header;