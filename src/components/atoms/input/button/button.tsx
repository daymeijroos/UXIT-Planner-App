import { type AriaButtonProps, useButton } from 'react-aria'
import { type HTMLProps, useRef } from 'react'
import { useFocusRing } from 'react-aria'
import classNames from 'classnames'
import React from 'react'
//button react element props
export function Button(props: { title?: string, color?: "gray" | "teal" | "red" } & AriaButtonProps & HTMLProps<HTMLButtonElement>): JSX.Element {
  const ref = useRef(null)
  const { buttonProps } = useButton(props, ref)
  const { children } = props
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <button className={classNames('w-full border-2 border-black p-4 drop-shadow-lg active:drop-shadow-none flex items-center justify-center',
      { 'bg-white hover:bg-gray-500 active:bg-gray-400 dark:bg-blue-gray-400 dark:border-blue-gray-500 dark:hover:bg-blue-gray-500 dark:active:bg-blue-gray-300': props.color == undefined },
      { 'bg-blue-gray-500 hover:bg-blue-gray-600 active:bg-blue-gray-300 dark:bg-blue-gray-500 dark:border-blue-gray-600 dark:hover:blue-gray-600 dark:active:bg-blue-gray-400': props.color === 'gray' },
      { 'bg-teal-500 hover:bg-teal-600 active:bg-teal-300 dark:bg-teal-500 dark:border-teal-600 dark:text-black dark:hover:teal-600 dark:active:teal-300': props.color === 'teal' },
      { 'bg-red-500 hover:bg-red-600 active:bg-red-300 dark:bg-red-400 dark:border-red-500 dark:hover:bg-red-500 dark:hover:border-red-600 dark:active:bg-red-300 dark:active:border-red-400': props.color === 'red' },
      { 'outline-none ring-4 ring-pale-yellow': isFocusVisible },
      props.className)}
      {...buttonProps}
      {...focusProps}
      {...props}
      ref={ref}>
      {children}
    </button>
  )
}
