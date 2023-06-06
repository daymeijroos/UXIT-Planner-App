'use client'

import React from 'react'
import { Bell, Calendar, User, Tool } from "react-feather"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "../../atoms/input/button"

export const NavigationBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const path = {
    home: {
      pathname: "/",
      active: () => pathname === path.home.pathname,
    }, account: {
      pathname: "/test/login",
      active: () => pathname === path.account.pathname,
    }, admin: {
      pathname: "/admin",
      active: () => pathname === path.admin.pathname,
    }, notifications: {
      pathname: "/meldingen",
      active: () => pathname === path.notifications.pathname,
    }
  }

  return (
    <nav className="fixed bottom-0 flex justify-center w-full p-4">
      <div className="flex w-full max-w-xl gap-4">
        <Button aria-label="Notificaties" title="Notificaties" color={path.notifications.active() ? "teal" : undefined} onPress={() => router.push(path.notifications.pathname)}>
          <Bell size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Kalender" title="Kalender" color={path.home.active() ? "teal" : undefined} onPress={() => router.push(path.home.pathname)}>
          <Calendar size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Account" title="Account" color={path.account.active() ? "teal" : undefined} onPress={() => router.push(path.account.pathname)}>
          <User size="24" className="stroke-5/4" />
        </Button>
        <Button aria-label="Admin" title="Admin" color={path.admin.active() ? "teal" : undefined} onPress={() => router.push(path.admin.pathname)}>
          <Tool size="24" className="stroke-5/4" />
        </Button>
      </div>
    </nav >
  )
};

