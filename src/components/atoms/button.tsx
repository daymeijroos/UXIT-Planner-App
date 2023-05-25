import { type AriaButtonProps, useButton } from 'react-aria';
import React from 'react';
import { useFocusRing } from 'react-aria';

export interface ButtonProps extends AriaButtonProps {
  title?: string;
  className?: string;
  color?: "primary" | "success" | "error";
  round?: boolean;
  fillWidth?: boolean;
}

const containerStyles = `m-4`;

const buttonStyles = {
  primary: `dark:bg-blue-grey dark:border-steel border-2 border-black py-4 px-4 text-black bg-blue-grey drop-shadow-lg hover:bg-steel active:bg-slate dark:active:bg-charcoal active:drop-shadow-none flex items-center justify-center`,
  success: `dark:bg-teal dark:border-light-teal border-2 border-black py-4 px-4 text-black bg-teal drop-shadow-lg hover:bg-light-teal active:bg-dark-teal dark:active:dark-teal active:drop-shadow-none flex items-center justify-center`,
  error: `dark:bg-red-orange dark:border-coral dark:text-white border-2 border-black py-4 px-4 text-black bg-coral drop-shadow-lg hover:bg-salmon active:bg-red-orange dark:active:bg-rust active:drop-shadow-none flex items-center justify-center`,
  default: `dark:border-steel dark:bg-[#00000000] dark:text-light-grey dark:hover:bg-steel  border-2 border-black py-4 px-4 text-black bg-white drop-shadow-lg hover:bg-light-grey active:bg-medium-grey dark:active:bg-slate active:drop-shadow-none flex items-center justify-center`,
}

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
    <div>
      <button className={`${props.color === "primary" ? buttonStyles.primary :
        props.color === "error" ? buttonStyles.error :
          props.color === "success" ? buttonStyles.success :
            buttonStyles.default
        } ${props.className ?? ''} 
      ${isFocusVisible ? focusStyles : ''}
      ${props.round ? 'rounded-full' : 'rounded-sm'}
      ${props.fillWidth ? 'w-full' : ''}`}

        title={props.title}
        {...buttonProps}
        {...focusProps}
        ref={ref}>
        {children}
      </button>
    </div>
  );
}
