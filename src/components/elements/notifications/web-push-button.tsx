import React, { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'
import { initializeOneSignalClient } from '../../../utils/notification-service'
import { Button } from '../../atoms'
import { useSession } from 'next-auth/react'

declare global {
  interface Window {
    OneSignal: any
  }
}

// welcome to await hell, there is so much async code that it is hard to grasp whats happening, the desired behavior is subscribe to notifications if not subscribed, and unsubscribe if subscribed
// also if permissions are not set, the user should be prompted to allow notifications
// if permissions are denied then it should not subscribe to notifications
export const WebPushButton: React.FC = () => {
  const [pushNotEnabled, setPushNotEnabled] = useState<boolean>(true)
  const session = useSession()
  const oneSignalState = useState<boolean>(false)

  useEffect(() => {
    if (session.status === "authenticated") {
      initializeOneSignalClient(session, oneSignalState).then(() => {
        OneSignal.isPushNotificationsEnabled().then((isPushEnabled: boolean) => {
          setPushNotEnabled(!isPushEnabled)
        })
      })
    }
  }, [session.status, pushNotEnabled])

  const toggleNotifications = async () => {
    if (pushNotEnabled) {
      try {
        await OneSignal.registerForPushNotifications()
        await OneSignal.setSubscription(true)
        setPushNotEnabled(false)
      } catch (error) {
        console.log('Error registering for push notifications:', error)
      }
    } else {
      await OneSignal.setSubscription(false)
      setPushNotEnabled(true)
    }
  }


  return (
    <Button onPress={toggleNotifications} color={pushNotEnabled ? "teal" : "red"}>{pushNotEnabled ? 'Subscribe to Notifications' : 'Unsubscribe from Notifications'}</Button>
  )
}