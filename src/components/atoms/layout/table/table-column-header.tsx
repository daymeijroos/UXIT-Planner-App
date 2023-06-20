import classNames from 'classnames'
import { useRef } from 'react'
import { AriaTableColumnHeaderProps, mergeProps, useFocusRing, useTableColumnHeader } from 'react-aria'
import { Column, TableState } from 'react-stately'

function TableColumnHeader<T>({ node: column, state }: AriaTableColumnHeaderProps<T> & { state: TableState<T> }) {
  let ref = useRef<HTMLTableCellElement>(document.createElement('th'))
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  )
  let { isFocusVisible, focusProps } = useFocusRing()
  let arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼'

  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      colSpan={column.colspan}
      style={{
        textAlign: column.colspan ? (column.colspan > 1 ? 'center' : 'left') : 'left',
        padding: '5px 10px',
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default'
      }}
      className={
        classNames(
          "px-1 py-2 outline-none cursor-default text-left",
          {
            "text-center": column.colspan ? (column.colspan > 1 ? true : false) : false,
          }
        )
      }
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting &&
        (
          <span
            aria-hidden="true"
            style={{
              padding: '0 2px',
              visibility: state.sortDescriptor?.column === column.key
                ? 'visible'
                : 'hidden'
            }}
          >
            {arrowIcon}
          </span>
        )}
    </th>
  )
}