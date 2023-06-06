'use client'

import React, { use, useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'
import { Button } from '../../atoms'
import { useSession } from 'next-auth/react'
import { env } from '../../../../env/client.mjs'

declare global {
  interface Window {
    OneSignal: any
  }
}

export const WebPushButton = () => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(false)
  const { data: sessionData, status } = useSession()
  const [oneSignalInitialized, setOneSignalInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!oneSignalInitialized) {
      OneSignal.init({
        appId: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        safari_web_id: env.NEXT_PUBLIC_ONESIGNAL_SAFARI_KEY,
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        setOneSignalInitialized(true)
      })
    }
  }, [])

  useEffect(() => {
    if (oneSignalInitialized && status === "authenticated" && sessionData?.user?.id) {
      OneSignal.setExternalUserId(sessionData?.user?.id)
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        setPushEnabled(isEnabled)
      })
    }
  }, [oneSignalInitialized, status])

  useEffect(() => {
    if (oneSignalInitialized) {
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        setPushEnabled(isEnabled)
      })
    }
  }, [oneSignalInitialized])

  const toggleNotifications = async () => {
    if (pushEnabled == false) {
      await OneSignal.registerForPushNotifications()
      await OneSignal.setSubscription(true)
    } else {
      await OneSignal.setSubscription(false)
    }
    OneSignal.isPushNotificationsEnabled((isEnabled) => {
      setPushEnabled(isEnabled)
    })
  }


  return (
    <Button onPress={toggleNotifications} color={!pushEnabled ? "teal" : "red"}>{!pushEnabled ? 'Subscribe to Notifications' : 'Unsubscribe from Notifications'}</Button>
  )
}