import { useRef } from "react"
import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import type { ButtonProps } from "@react-types/button"
import type { AriaButtonProps } from 'react-aria'
import classNames from "classnames"

export function ButtonRound(props: ButtonProps & AriaButtonProps & { border?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)
  const { focusProps, isFocusVisible } = useFocusRing()
  return (
    <button
      className={classNames("flex items-center justify-center h-12 w-12 border-2 border-black dark:border-blue-gray-500 bg-white hover:bg-gray-500 active:bg-gray-400 dark:bg-blue-gray-400 active:dark:border-blue-gray-500  dark:hover:bg-blue-gray-500 dark:active:bg-blue-gray-300 rounded-full",
        { "outline-none ring-4 ring-pale-yellow": isFocusVisible })}
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
    >
      {props.children}
    </button>
  )
}
