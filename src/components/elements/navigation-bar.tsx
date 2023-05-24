import React from "react";
import { Bell, Calendar, User, Tool } from "react-feather";
import { useRouter } from "next/navigation";
import { Button } from "../atoms/button";

export const NavigationBar = () => {
  const router = useRouter();
  return (
    <nav className=" dark:bg-slate dark:text-white dark:border-steel fixed bottom-0 bg-white text-black py-3 px-6 flex items-center w-screen justify-center space-x-4">
      <Button aria-label="Notificaties" title="Notificaties">
        <Bell className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button aria-label="Kalender" title="Kalender" color="success" onPress={() => router.push("/")}>
        <Calendar className="stroke-1 dark:stroke-black" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button aria-label="Account" title="Account" onPress={() => router.push("/test/login")}>
        <User className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button aria-label="Admin" title="Admin" onPress={() => router.push("/admin")}>
        <Tool className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};

