import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../aria/button";

const LoginExample: React.FC = () => {
  const { data: sessionData } = useSession();

  //make it with an unstyled Button element
  return (
    <>
      {sessionData && <div>Logged in as {sessionData.user.email}</div>}
      <Button onPress={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </>
  )
}

export default LoginExample