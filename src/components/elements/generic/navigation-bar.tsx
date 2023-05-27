'use client'

import { Bell, Calendar, User, Tool } from "react-feather"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "../../atoms/input/button"

export const NavigationBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const path = {
    home: {
      active: pathname === "/",
    }, account: {
      active: pathname === "/test/login",
    }, admin: {
      active: pathname === "/admin",
    }, notifications: {
      active: pathname === "/notifications",
    }
  }

  return (
    <nav className="fixed bottom-0 flex justify-center w-full p-4">
      <div className="flex w-full max-w-xl gap-4">
        <Button aria-label="Notificaties" title="Notificaties" color={path.notifications.active ? "teal" : undefined}>
          <Bell size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Kalender" title="Kalender" color={path.home.active ? "teal" : undefined} onPress={() => router.push("/")}>
          <Calendar size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Account" title="Account" color={path.account.active ? "teal" : undefined} onPress={() => router.push("/test/login")}>
          <User size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Admin" title="Admin" color={path.admin.active ? "teal" : undefined} onPress={() => router.push("/admin")}>
          <Tool size="24" className="stroke-5/4" />
        </Button>
      </div>
    </nav >
  )
};

