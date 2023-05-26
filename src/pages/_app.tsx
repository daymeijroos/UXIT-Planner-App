import '../styles/globals.css'
import type { AppType } from 'next/app'
import type { Session } from "next-auth"
import { api } from '../utils/api'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { SSRProvider } from 'react-aria'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          reverseOrder={false} />
      </SessionProvider>
    </SSRProvider>
  )
}

export default api.withTRPC(MyApp)
