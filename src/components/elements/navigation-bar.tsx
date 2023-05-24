import React from "react";
import { Bell, Calendar, User, Tool } from "react-feather";
import { useRouter } from "next/navigation";
import { Button } from "../atoms/button";
import { api } from "../../utils/api";

export const NavigationBar = () => {


  const router = useRouter();
  return (
    <nav className=" dark:bg-slate dark:text-white dark:border-steel fixed bottom-0 bg-white text-black py-3 px-6 flex items-center w-screen justify-center space-x-4">
      <Button aria-label="Notificaties" title="Notificaties">
        <Bell className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button color="success" onPress={() => router.push("/")} aria-label="Kalender" title="Kalender">
        <Calendar className="stroke-1 dark:stroke-black" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button aria-label="Account" title="Account">
        <User className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
      <Button onPress={() => router.push("/admin")} aria-label="Admin" title="Admin">
        <Tool className="stroke-1 dark:stroke-white" color="#000" size="24" width="30" height="30" />
      </Button>
    </nav>
  );
};

