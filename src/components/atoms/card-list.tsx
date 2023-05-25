export function CardList<T extends object>({ CardLayout, objects }: { CardLayout: (object: T) => JSX.Element, objects: T[] }) {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {objects.map((object) => (
        CardLayout(object)
      ))}
    </div>
  )
}