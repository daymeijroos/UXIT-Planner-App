import React from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useTextField } from 'react-aria';

//make it pretty using tailwind
interface TextFieldProps extends AriaTextFieldProps {
    error?: string | (() => void);
    label?:string


}

export function TextField(props: TextFieldProps) {
    const { label } = props;
    const ref = React.useRef(null);
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref);

    return (
        <div className="mb-4 dark:bg-[#00000000] dark:text-white dark:border-steel">
            <label htmlFor="label" className="block text-gray-700 font-medium mb-1" {...labelProps}>{props.label}
            </label>
            <input {...inputProps}
                   ref={ref}
                   className={`border-2 border-b-8 border-black p-2 ${
                       props.error ? 'border-red-500' : 'border-2 border-b-8 border-black p-2'
                   } px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full`} />
            {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
        </div>
    );
}
