import {AriaButtonProps, useButton} from 'react-aria';
import React from 'react';
import {useFocusRing} from 'react-aria';

export interface ButtonProps extends AriaButtonProps {
  className?: string;
  color?: "primary" | "success" | "error";
  round?: boolean;
}

const buttonStyles = {
  primary: `border-2 border-black py-4 px-4 m-4 text-black bg-blue-grey drop-shadow-lg hover:bg-steel active:bg-slate active:drop-shadow-none flex items-center justify-center`,
  success: `border-2 border-black py-4 px-4 m-4 text-black bg-teal drop-shadow-lg hover:bg-light-teal active:bg-dark-teal active:drop-shadow-none flex items-center justify-center`,
  error: `border-2 border-black py-4 px-4 m-4 text-black bg-coral drop-shadow-lg hover:bg-salmon active:bg-red-orange active:drop-shadow-none flex items-center justify-center`,
  default: `border-2 border-black py-4 px-4 m-4 text-black bg-white drop-shadow-lg hover:bg-light-grey active:bg-light-grey active:drop-shadow-none flex items-center justify-center`,
};

const focusStyles = 'outline-none ring-4 ring-pale-yellow'

/**
 * 
 * @param props: {className?: string; color?: "primary" | "success" | "error"; round?: boolean;}
 * @returns a styled button
 */
export function Button(props: ButtonProps) {
  const ref = React.useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button className={`${
      props.color === "primary" ? buttonStyles.primary :
      props.color === "error" ? buttonStyles.error :
      props.color === "success" ? buttonStyles.success :
      buttonStyles.default
    } ${props.className} 
    ${isFocusVisible ? focusStyles : ''}
    ${props.round ? 'rounded-full' : 'rounded-sm'}`}
    
      {...buttonProps}
      {...focusProps}
      ref={ref}>
      {children}
    </button>
  );
}
