import { ReactElement, useRef } from 'react'
import { type GridRowProps, useTableHeaderRow } from 'react-aria'
import { TableState } from 'react-stately'


export function TableHeaderRow<T>({ props: { node: item }, state, children }: { props: GridRowProps<T>, state: TableState<T>, children: React.ReactNode }) {
  let ref = useRef<HTMLTableRowElement>(document.createElement('tr'))
  let { rowProps } = useTableHeaderRow({ node: item }, state, ref)

  return (
    <tr {...rowProps} ref={ref}>
      {children}a
    </tr>
  )
}