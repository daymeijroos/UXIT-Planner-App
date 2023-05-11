import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';


const { mutate: createRequiredStandByStaffing } = api.requiredStaffing.createRequiredStandByStaffing.useMutation();
const TypeShift = api.requiredStaffing.getReserveType.useQuery();
const ShiftTest = api.requiredStaffing.getShift.useQuery();


export function AddRequiredStaffing() {
    return (
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
            onClick={
                () => {
                    createRequiredStandByStaffing({
                        shift_id: ShiftTest.data?.id,
                        amountOfStaffRequired: 1,
                        shiftType_id: TypeShift.data?.id,
                    });
                }
            }
        />  
      </div>
    );
  }
  
export default AddRequiredStaffing;