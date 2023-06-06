import { Button, Card, LoadingMessage, TextField, ToastService } from "../../components"
import { api } from "../../utils/api"

export default function AtomTest() {
  const { mutate: testClick } = api.notification.send.useMutation()

  const message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  return (
    <div className="flex flex-col w-64 gap-4 ">
      <h1>Atom Test</h1>
      <Button color="gray" onPress={() => ToastService.info(message)}>Primary</Button>
      <Button color="teal" onPress={() => ToastService.success(message)}>Success</Button>
      <Button color="red" onPress={() => ToastService.error(message)}>Error</Button>
      <Button onPress={() => { testClick() }}>Default</Button>
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