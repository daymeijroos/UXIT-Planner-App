import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "../atoms/input/button"

const LoginExample: React.FC = () => {
  const { data: sessionData, status } = useSession()

  //make it with an unstyled Button element
  return (
    <>
      {status === "authenticated" && <div>Logged in as {sessionData.user?.email} - {sessionData.user?.name} </div>}
      <Button onPress={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </>
  )
}

export default LoginExample