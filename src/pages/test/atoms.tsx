import { Button, Card, LoadingMessage, TextField } from "../../components"

export default function AtomTest() {
  return (
    <div className="flex flex-col w-64 gap-4 ">
      <h1>Atom Test</h1>
      <Button color="gray">Primary</Button>
      <Button color="teal">Success</Button>
      <Button color="red">Error</Button>
      <Button>Default</Button>
      <TextField placeholder="Test placeholder" label="Test label" description={"Test description"} />
      <TextField placeholder="Error placeholder" label="Error label" description={"Error description"} error={"Error"} />
      <Card>
        <h1>Card</h1>
        <p>Test card.</p>
      </Card>
      <LoadingMessage />
    </div>

  )
}