import { signIn, useSession } from "next-auth/react";
import React from "react";
import { Button } from "../atoms/button";
import { LoadingMessage } from "./loading-message";
import { useRouter } from "next/router";

export function AssertLogin({ children, enabled }: { children: React.ReactNode, enabled?: boolean }): React.ReactElement {
  const router = useRouter();
  const { data: sessionData } = useSession();
  console.log(sessionData);

  if (sessionData === undefined) {
    return (
      <div className="min-h-screen">
        <LoadingMessage />
      </div>
    );
  }
  //exclude every path that is starts with /auth/... from the login check
  if (!sessionData?.user && enabled && !router.pathname.startsWith("/auth/")) {
    signIn();
  }
  return <>{children}</>;
}