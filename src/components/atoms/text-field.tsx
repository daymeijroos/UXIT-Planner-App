import React from 'react';
import type {AriaTextFieldProps} from 'react-aria';
import {useTextField} from 'react-aria';

//make it pretty using tailwind

export function TextField(props: AriaTextFieldProps) {
  const { label } = props;
  const ref = React.useRef(null) ;
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref);

  return (
    <div className='flex flex-col gap-2'>
      <label {...labelProps} className="text-gray-700">{label}</label>
      <input {...inputProps} ref={ref} className="border-2 border-gray-300 p-2 rounded-lg"/>
      {props.description && (
        <div {...descriptionProps} className="text-gray-500">
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} className="text-red-500">
          {props.errorMessage}
        </div>
      )}
    </div>
  );
}