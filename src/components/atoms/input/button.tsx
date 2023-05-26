import { type AriaButtonProps, useButton } from 'react-aria'
import React from 'react'
import { useFocusRing } from 'react-aria'
import classNames from 'classnames'

export interface ButtonProps extends AriaButtonProps {
  title?: string
  className?: string
  color?: "gray" | "teal" | "red"
  round?: boolean
  fillWidth?: boolean
}

const buttonStyles = {
  //   primary: `dark:bg-blue-gray-500 dark:blue-gray-600 bg-blue-gray-500 hover:bg-blue-gray-600 active:bg-blue-gray-400 dark:active:bg-blue-gray-600`,
  //   success: `dark:bg-teal-500 dark:border-teal-300 bg-teal hover:bg-light-teal active:bg-teal-300 dark:active:teal-300`,
  //   error: `dark:bg-red-orange dark:border-coral dark:text-white bg-coral hover:bg-salmon active:bg-red-orange dark:active:bg-rust`,
  //   default: `dark:border-steel dark:bg-[#00000000] dark:text-light-grey dark:hover:bg-steel bg-white hover:bg-light-grey active:bg-medium-grey dark:active:bg-slate`,
}

const focusStyles = 'outline-none ring-4 ring-pale-yellow'

/**
 * 
 * @param props: {className?: string; color?: "primary" | "success" | "error"; round?: boolean;}
 * @returns a styled button
 */
export function Button(props: ButtonProps) {
  const ref = React.useRef(null)
  const { buttonProps } = useButton(props, ref)
  const { children } = props
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <div>
      <button className={classNames('border-2 border-black py-4 px-4 drop-shadow-lg active:drop-shadow-none flex items-center justify-center',
        { 'bg-white hover:bg-gray-500 active:bg-gray-400 dark:bg-blue-gray-400 dark:border-blue-gray-600 dark:hover:bg-blue-gray-500 dark:active:bg-blue-gray-300': props.color == undefined },
        { 'bg-blue-gray-500 hover:bg-blue-gray-600 active:bg-blue-gray-300 dark:bg-blue-gray-500 dark:border-blue-gray-600 dark:hover:blue-gray-600 dark:active:bg-blue-gray-400': props.color === 'gray' },
        { 'bg-teal-500 hover:bg-teal-600 active:bg-teal-300 dark:bg-teal-500 dark:border-teal-600 dark:hover:teal-600 dark:active:teal-300': props.color === 'teal' },)}

        // ${isFocusVisible ? focusStyles : ''}
        // ${props.round ? 'rounded-full' : 'rounded-sm'}
        // ${props.fillWidth ? 'w-full' : ''}`}


        title={props.title}
        {...buttonProps}
        {...focusProps}
        ref={ref}>
        {children}
      </button>
    </div >
  )
}
