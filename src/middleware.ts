import { type NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { Role } from "../prisma/role"
import { NextResponse } from "next/server"

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

export const config = {
  matcher: ["/", "/api/:path*", "/admin/:path*"],
}