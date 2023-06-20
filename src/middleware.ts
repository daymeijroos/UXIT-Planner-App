import { type NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { Role } from "../prisma/role"
import { NextResponse } from "next/server"

/**
  * The following function is ran after a request is received but before returning a response
  * It is used to check if a user is authorized to access a page, and if not redirect them
  * @see https://nextjs.org/docs/pages/building-your-application/routing/middleware
  */
export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      !(req.nextUrl.pathname.startsWith("/auth") || req.nextUrl.pathname.startsWith("/api") || (req.nextauth && req.nextauth.token))
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token && token.role !== Role.RETIRED
      }
    }
  }
)

/**
  * This is the configuration for the middleware
  * It is used to specify which routes the middleware should be applied to
  * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
  */
export const config = {
  matcher: ["/", "/api/:path*", "/admin/:path*", "/test/:path*, /open-shift/:path*, /meldingen/:path*"],
}