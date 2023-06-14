import { AriaListBoxProps, AriaTableProps, AriaTableSelectionCheckboxProps, mergeProps, useFocusRing, useTable } from 'react-aria'
import { Cell, Column, Row, TableBody, TableHeader, useTableState } from 'react-stately'
import { useRef } from 'react'
import { TableRowGroup, TableHeaderRow } from '.'

function Table<T extends object>(props: AriaTableProps<T> & AriaListBoxProps<T>) {
  const { selectionMode, selectionBehavior } = props
  const state = useTableState({
    ...props,
    showSelectionCheckboxes: selectionMode === 'multiple' &&
      selectionBehavior !== 'replace'
  })
  //not undefined
  const ref = useRef<HTMLTableElement>(document.createElement('table'))
  const { collection } = state
  const { gridProps } = useTable(props, state, ref)

  return (
    <table {...gridProps} ref={ref} style={{ borderCollapse: 'collapse' }
    }>
      <TableRowGroup type="thead" >
        {
          collection.headerRows.map((headerRow) => (
      <TableHeaderRow key= { headerRow.key } item = { headerRow } state = { state } >
      {
        [...headerRow.childNodes].map((column) =>
          column.props.isSelectionCell
            ? (
              <TableSelectAllCell
                    key= { column.key }
                    column = { column }
                    state = { state }
          />
                )
                : (
            <TableColumnHeader
                    key={ column.key }
                    column = { column }
                    state = { state }
            />
                )
    )
  }
    < /TableHeaderRow>
        ))}
</TableRowGroup>
  < TableRowGroup type = "tbody" >
  {
    [...collection.body.childNodes].map((row) => (
      <TableRow key= { row.key } item = { row } state = { state } >
      {
        [...row.childNodes].map((cell) =>
          cell.props.isSelectionCell
            ? <TableCheckboxCell key={ cell.key } cell = { cell } state = { state } />
                : <TableCell key={ cell.key } cell = { cell } state = { state } />
            )
      }
      < /TableRow>
    ))
  }
    < /TableRowGroup>
    < /table>
  );
}