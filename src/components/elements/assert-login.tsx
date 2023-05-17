import { signIn, useSession } from "next-auth/react";
import React from "react";
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
  if (sessionData === null && enabled && !router.pathname.startsWith("/auth/")) {
    console.log("redirecting");
    signIn();
  }
  return <>{children}</>;
}