import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import { Button } from "../components/atoms/button";
import { Selector } from "../components/atoms/selector";
import { TextField } from "../components/atoms/text-field";
import { api } from "../utils/api";



export default function addShift() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const getAllShiftTypeNames = api.schedule.getShiftTypes.useQuery();

    // convert getAllShiftTypeNames to this type
    // const options = [
    //     { value: 'option1', label: 'Option 1' },
    //     { value: 'option2', label: 'Option 2' },
    //     { value: 'option3', label: 'Option 3' },
    //   ];

    const options = getAllShiftTypeNames.data?.map((shiftType) => ({
            value: shiftType.name,
            label: shiftType.name,
        })) || [];

    console.log(
        getAllShiftTypeNames.data? "data is not null" : "data is null"
    );


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const res = await fetch('/api/addShift', {
            body: JSON.stringify({
                name,
                description,
                date,
                startTime,
                endTime,
                location
                // maxParticipants,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        const result = await res.json();
        if (result.error) {
            setErrorMessage(result.error);
        } else {
            router.push('/admin');
        }
    }
    
    return (
        // form max width 600 px and center the screen
        <div className='
            flex flex-col
            items-center
            justify-center
            min-h-screen'>
            <h1>
            Add a shift
            </h1>
            <form 
            className='
                flex flex-col
                gap-2
                max-w-100
                p-4
            '
            onSubmit={handleSubmit}>
            
            
            <div className='
                    flex flex-col
                    gap-2
                    w-80
                    mx-auto
                '>
                <TextField type="date" name="date" id="date" label="Date"  value={date} onChange={(value) => setDate(value)} />
            </div>
          
            <div className="flex flex-col
                    gap-2
                    w-80
                    mx-auto">

                
            </div>
            
            <Button className='w-[100%]' type="submit" color="success" title="Add shift" aria-label="Add shift"> 
                Add shift
            </Button>
          
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    </div>
    );
}