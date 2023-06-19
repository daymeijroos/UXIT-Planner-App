import { type AriaDateFieldProps, type DateValue, useDateField, useDateSegment, useLocale } from 'react-aria'
import { DateFieldState, DateSegment, useDateFieldState } from 'react-stately'
import { createCalendar } from '@internationalized/date'
import React from 'react'
import classNames from 'classnames'

export function DatetimeField<T extends DateValue>(props: AriaDateFieldProps<T>, id: string) {
    let { locale } = useLocale()
    let state = useDateFieldState({
        ...props,
        locale,
        createCalendar
    })

    let ref = React.useRef(null)
    let { labelProps, fieldProps } = useDateField(props, state, ref)

    return (
        <div className="flex">
            <span id={id} {...labelProps}>{props.label}</span>
            <div {...fieldProps} ref={ref} className="flex">
                {state.segments.map((segment, i) => (
                    <DateSegment key={i} segment={segment} state={state} />
                ))}
                {state.validationState === 'invalid' &&
                    <span aria-hidden="true">🚫</span>}
            </div>
        </div>
    )
}

function DateSegment({ segment, state }: { segment: DateSegment, state: DateFieldState }) {
    let ref = React.useRef(null)
    let { segmentProps } = useDateSegment(segment, state, ref)

    return (
        <div
            {...segmentProps}
            ref={ref}
            className={classNames(
                'w-full',
                { 'text-blue-gray-600': segment.isPlaceholder },
            )}
        >
            {segment.text}
            &nbsp;
        </div>
    )
}
