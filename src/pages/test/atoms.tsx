import { Button } from "../../components"

export default function AtomTest() {
  return (
    <div className="flex flex-col w-64 gap-4 ">
      <h1>Atom Test</h1>
      <Button color="gray">Primary</Button>
      <Button color="teal">Success</Button>
      <Button color="red">Error</Button>
      <Button>Default</Button>
    </div>

  )
}