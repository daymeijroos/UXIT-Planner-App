import React from 'react'
import type { AriaTextFieldProps } from 'react-aria'
import { useTextField } from 'react-aria'

//make it pretty using tailwind
interface TextFieldProps extends AriaTextFieldProps {
    error?: string | (() => void)
}

export function TextField(props: TextFieldProps) {
    const ref = React.useRef(null)
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

    return (
        <div className="mb-4 dark:text-white dark:border-steel w-fill">
            <label htmlFor="label" className="block text-gray-700 dark:text-steel font-medium mb-1" {...labelProps}>{props.label}
            </label>
            <input {...inputProps}
                ref={ref}
                className={`border-2 border-b-8 border-black p-2 dark:bg-slate dark:border-steel ${props.error ? 'border-red-500' : 'border-2 border-b-8 border-black p-2'
                    } px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full`} />
            {!props.error && props.description && <p className="text-gray-500 text-sm" {...descriptionProps}>{props.description}</p>}
            {props.error && <p className="text-red-500 text-sm" {...errorMessageProps}>{props.error}</p>}
        </div>
    )
}
