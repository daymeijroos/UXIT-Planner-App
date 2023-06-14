import React from 'react'
import type { AriaDialogProps } from 'react-aria'
import { useDialog } from 'react-aria'

interface DialogProps extends AriaDialogProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export function Dialog({ title, children, ...props }: DialogProps) {
  let ref = React.useRef(null)
  let { dialogProps, titleProps } = useDialog(props, ref)

  return (
    <div {...dialogProps} ref={ref} style={{ padding: 30 }}>
      {title &&
        (
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
        )}
      {children}
    </div>
  )
}