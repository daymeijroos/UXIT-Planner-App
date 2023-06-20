import { useTableRowGroup } from 'react-aria'

export function TableRowGroup({ type, children }: { type: 'thead' | 'tbody', children: React.ReactNode }) {
  let { rowGroupProps } = useTableRowGroup()

  const Element = type === 'thead' ? 'thead' : 'tbody'

  return (
    <Element
      {...rowGroupProps}
      style={type === 'thead'
        ? { borderBottom: '2px solid var(--spectrum-global-color-gray-800)' }
        : undefined}
    >
      {children}
    </Element>
  )
}
