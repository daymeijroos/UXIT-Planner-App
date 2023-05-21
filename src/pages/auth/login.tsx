import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import type { Provider } from "next-auth/providers";
import { TextField } from "../../components/atoms/text-field";
import type { FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "../../components/atoms/button";

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(),
    },
  };
}

export default function Login({ providers }: { providers: Provider[] }) {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      <Image src="/images/logo_linework.svg" alt="Logo" width={200} height={200} />
      <h1 className="text-5xl font-bold text-teal">Log in</h1>
      <div className="flex flex-col items-end">
        {Object.values(providers).map((provider) => {
          if (provider.name === "Email") {
            return <EmailSignIn error={error === "EmailSignin"} key={provider.name} />;
          }
          return (
            <div key={provider.name}>
              <Button onPress={() => void signIn(provider.id)}>
                Sign in with {provider.name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function EmailSignIn({ error }: { error?: boolean }) {
  return (
    <form onSubmit={submitFunction}>
      <TextField type="email" id="email" name="email" label="E-mailadres" placeholder="john@deere.nl" errorMessage={error ? "Email sign-in failed. Please try again." : undefined} />
      <Button type="submit" fillWidth>Log in met Email</Button>
    </form>
  )
}

const submitFunction = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const target = event.target as typeof event.target & {
    email: { value: string };
  };
  const email = target.email.value;
  void signIn("email", { email });
};