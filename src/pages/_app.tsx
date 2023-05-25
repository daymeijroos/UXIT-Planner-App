import Head from 'next/head'
import '../styles/globals.css'
import type { AppType } from 'next/app'
import { type Session } from "next-auth";
import { api } from '../utils/api';
import { SessionProvider } from 'next-auth/react';
import {I18nProvider, SSRProvider, useLocale} from 'react-aria';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },



}) => {
  const locale = "nl-NL";
  const direction = "ltr";
  return (
    <SessionProvider session={session}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Next.js PWA Example</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#5FC9BE" />
      </Head>
      <SSRProvider>
        <I18nProvider locale={locale}>
          <Component {...pageProps} />
        </I18nProvider>
      </SSRProvider>

    </SessionProvider>
  );
}

export default api.withTRPC(MyApp)
