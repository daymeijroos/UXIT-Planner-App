import React from 'react';
import { useRouter } from 'next/navigation';

const schedule = () => {
  const router = useRouter();
  return (
    <div>

      <div>
        <p>11:45 - 17:15</p>
        <p>Do 20 april</p>
        <p> Balie-dienst </p>
        <p>note</p>
        <ul>
            <li> Inwerken Niek (2de shift) </li>
        </ul>
        <p>Balie:   U, Niek</p>
        <p>Zaal:    Henk, Laura</p>
      </div>  

      <div>
        <p>11:45 - 17:15</p>
        <p>Do 20 april</p>
        <p> Balie-dienst </p>
        <p>note</p>
        <ul>
            <li> Inwerken Niek (2de shift) </li>
        </ul>
        <p>Balie:   U, Niek</p>
        <p>Zaal:    Henk, Laura</p>
      </div>  

    </div>

  );
};


export default schedule;