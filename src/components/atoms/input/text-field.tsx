import classNames from 'classnames'
import React from 'react'
import type { AriaTextFieldProps } from 'react-aria'
import { useTextField } from 'react-aria'
import { AlertOctagon } from 'react-feather'

export function TextField(props: { error?: string } & AriaTextFieldProps) {
    const ref = React.useRef(null)
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

    return (
        <div className={"w-full dark:text-white flex flex-col"}>
            <label htmlFor="label" className={classNames(
                { 'dark:text-red-500': props.error }
            )}{...labelProps}>{props.label}</label>
            <input ref={ref} className={classNames(
                'p-4 w-full border-2 border-b-8 border-black dark:bg-blue-gray-400 dark:border-blue-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500',
                { 'border-red-500 dark:border-red-400': props.error }
            )}{...inputProps} />
            {
                !props.error && props.description && <p className="text-sm text-gray-500 dark:text-blue-gray-600" {...descriptionProps}>{props.description}</p>
            }
            {
                props.error && <p className="flex items-center text-sm text-red-500 dark:text-red-400" {...errorMessageProps}>
                    <AlertOctagon size={12} className='mr-1 mt-1/2' />{props.error}
                </p>
            }
        </div>
    )
}
