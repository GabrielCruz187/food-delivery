import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if this is an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for admin token in cookies
    const adminToken = request.cookies.get("sb-access-token")

    if (!adminToken) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
