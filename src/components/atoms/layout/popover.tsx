import React from "react"
import type { OverlayTriggerState } from "react-stately"
import type { AriaPopoverProps } from "@react-aria/overlays"
import { usePopover, DismissButton, Overlay } from "@react-aria/overlays"

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode
  state: OverlayTriggerState
  className?: string
  popoverRef?: React.RefObject<HTMLDivElement>
}

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { popoverRef = ref, state, children, isNonModal } = props

  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef
    },
    state
  )

  return (
    <Overlay>
      {!isNonModal && <div {...underlayProps} className="fixed inset-0" />}
      <div
        {...popoverProps}
        ref={popoverRef}
        className={`z-10 shadow-lg border border-gray-300 dark:bg-gray-700 bg-white rounded-sm mt-2`}
      >
        {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  )
}
