import { Dispatch, SetStateAction, useState } from 'react'
import OneSignal from 'react-onesignal'
import { env } from '../../env/client.mjs'
import { Session } from 'next-auth'

export const initializeOneSignalClient = async (session: { data: Session }, oneSignalState: [boolean, Dispatch<SetStateAction<boolean>>]) => {
  const { data: sessionData } = session
  const [oneSignalInitialized, setOneSignalInitialized] = oneSignalState

  if (sessionData?.user?.id) {
    if (oneSignalInitialized) {
      return
    }
    await OneSignal.init({
      appId: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      safari_web_id: "web.onesignal.auto.5694d1e9-fcaa-415d-b1f1-1ef52daca700",
      allowLocalhostAsSecureOrigin: true,
    })
    await OneSignal.setExternalUserId(sessionData?.user?.id)
    setOneSignalInitialized(true)
  }
}