import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import type { Provider } from "next-auth/providers"
import type { FormEvent } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Head from "next/head"
import { TextField, Button } from "../../components"
import React from 'react'

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(),
    },
  }
}

export default function Login({ providers }: { providers: Provider[] }) {
  const router = useRouter()
  const { error } = router.query

  return (
    <>
      <Head>
        <title>Login | Pulchri Planner</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Image src="/images/logo_linework.svg" alt="Logo" width={200} height={200} className="filter brightness-0 dark:brightness-50 dark:filter-blue dark:invert" />
        <h1 className="font-bold text-teal-500 dark:text-white">Log in</h1>
        <div className="flex flex-col items-end w-96">
          {Object.values(providers).map((provider) => {
            if (provider.name === "Email") {
              return <EmailSignIn error={error === "EmailSignin"} key={provider.name} />
            }
            return (
              <div key={provider.name} className="w-full">
                <Button onPress={() => void signIn(provider.id)}>
                  Sign in with {provider.name}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}


function EmailSignIn({ error }: { error?: boolean }) {
  return (
    <form onSubmit={submitFunction} className="flex flex-col w-full gap-4">
      <TextField type="email" id="email" name="email" label="E-mailadres" placeholder="john@deere.nl" error={error ? "Inloggen met E-mail mislukt" : undefined} />
      <Button type="submit" color="teal">Log in met Email</Button>
    </form>
  )
}

const submitFunction = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const target = event.target as typeof event.target & {
    email: { value: string }
  }
  const email = target.email.value
  void signIn("email", { email })
}