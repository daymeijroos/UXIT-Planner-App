import {AriaButtonProps, useButton} from 'react-aria';
import React from 'react';

export function Button(props: AriaButtonProps) {
  const ref = React.useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-4"
      {...buttonProps} 
      ref={ref}>
      {children}
    </button>
  );
}
