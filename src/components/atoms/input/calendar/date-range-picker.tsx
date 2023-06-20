import { type AriaDateRangePickerProps, type DateValue, useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'

// Reuse the DateField, Popover, Dialog, RangeCalendar, and Button from your component library.
import { RangeCalendar } from './'
import { Button } from '../button'
import React from 'react'
import { DateField } from './date-field'
import { Popover } from '../../layout/popover'
import { Dialog } from '../../layout/dialog'
import { Calendar } from 'react-feather'

export function DateRangePicker<T extends DateValue>(props: AriaDateRangePickerProps<T>) {
  let state = useDateRangePickerState(props)
  let ref = React.useRef(null)
  let {
    labelProps,
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDateRangePicker(props, state, ref)

  return (
    <div className='flex flex-col w-full'>
      <span {...labelProps}>{props.label}</span>
      <div {...groupProps} ref={ref} className='flex'>
        <div className="flex items-center justify-center w-full border-2 border-r-0 border-black dark:border-blue-gray-500">
          <DateField {...startFieldProps} />
          <span style={{ padding: '0 4px' }}>–</span>
          <DateField {...endFieldProps} />
          {state.validationState === 'invalid' &&
            <span aria-hidden="true">🚫</span>}
        </div>
        <div className='w-min'>
          <Button {...buttonProps}><Calendar width={24} height={24} /></Button>
        </div>
      </div>
      {state.isOpen &&
        (
          <Popover state={state} triggerRef={ref} placement="bottom start">
            <Dialog {...dialogProps}>
              <RangeCalendar {...calendarProps} />
            </Dialog>
          </Popover>
        )}
    </div>
  )
}