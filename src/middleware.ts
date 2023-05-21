import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { Role } from "../prisma/role";
import { NextResponse } from "next/server";

export function middleware(req: NextRequestWithAuth) {
  if (
    !(isAuthPage(req) || isApiEndpoint(req) || isAuthenticated(req) || reqContainsTokenParamter(req))
  ) {
    console.log(req.url.toString())
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (adminPageNotAdmin(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
};

export const config = {
  matcher: ["/", "/admin/:path*"],
}

const isAuthPage = (req: NextRequestWithAuth) => req.nextUrl.pathname.startsWith("/auth")
const isApiEndpoint = (req: NextRequestWithAuth) => req.nextUrl.pathname.startsWith("/api")
const isAuthenticated = (req: NextRequestWithAuth) => (req.nextauth && req.nextauth.token)
const adminPageNotAdmin = (req: NextRequestWithAuth) => req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role == Role.ADMIN
const reqContainsTokenParamter = (req: NextRequestWithAuth) => req.nextUrl.searchParams.has("token")