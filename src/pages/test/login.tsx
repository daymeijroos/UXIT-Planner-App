import { NavigationBar } from "../../components"
import LoginExample from "../../components/example/login.example"
import { WebPushButton } from "../../components/elements/notifications/web-push-button"

const Index = () => {
  return (
    <>
      <LoginExample />
      <WebPushButton />
      <NavigationBar />
    </>
  )
}

export default Index