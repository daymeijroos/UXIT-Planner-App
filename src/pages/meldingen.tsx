import { Button, Card, CardList, LoadingMessage, NavigationBar } from "../components"
import { api } from "../utils/api"
import { X } from "react-feather"
import { useRouter } from "next/router"
import React from 'react'

const Index = () => {
  const notifications = api.notification.getAll.useQuery()
  const { mutate: deleteNotification } = api.notification.delete.useMutation({
    onSuccess: () => {
      notifications.refetch().catch((e) => {
        console.log(e)
      })
    }
  })
  const router = useRouter()

  return (
    <>
      <div className="flex justify-center max-h-screen pb-24">
        <div className="flex flex-col w-full max-w-xl gap-8 pt-8">
          <h1>Notifications</h1>
          {
            notifications.isLoading ? <LoadingMessage /> :
              notifications.data ? <div className="overflow-scroll">
                <CardList objects={notifications.data} CardLayout={
                  (notification) => (
                    <Card key={notification.id} className="flex justify-between">
                      <div className="flex flex-col gap-4">
                        <h3> {notification.contents?.en} </h3>
                        {notification.web_url &&
                          <Button onPress={
                            () => {
                              router.push(new URL(notification.web_url ? notification.web_url : "/"))
                                .catch((e) => console.log(e))
                            }
                          }>Open</Button>
                        }
                      </div>
                      <X onClick={
                        () => { if (notification.id) deleteNotification({ id: notification.id }) }
                      } />
                    </Card>
                  )
                } />
              </div> :
                <p>Er zijn geen notificaties</p>
          }
        </div>
      </div>
      <NavigationBar />
    </>
  )
}

export default Index
