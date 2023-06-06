import '../styles/globals.css'
import type { AppType } from 'next/app'
import { type Session } from "next-auth"
import { api } from '../utils/api'
import { SessionProvider } from 'next-auth/react'
import { I18nProvider, SSRProvider } from 'react-aria'



const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  const locale = "nl-NL"
  return (
    <>
      <SessionProvider session={session}>
        <SSRProvider>
          <I18nProvider locale={locale}>
            <Component {...pageProps} />
          </I18nProvider>
        </SSRProvider>
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
