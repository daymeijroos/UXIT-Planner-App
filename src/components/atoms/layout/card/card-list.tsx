import React from 'react'

export function CardList<T extends object>({ CardLayout, objects }: { CardLayout: (object: T) => JSX.Element, objects: T[] }) {
  return (
    <div className="flex flex-col w-full gap-4">
      {objects.map((object) => (
        CardLayout(object)
      ))}
    </div>
  )
}