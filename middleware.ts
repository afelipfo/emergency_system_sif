import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Check for mock user in development (when Supabase is not configured)
  const mockUser = request.cookies.get("mock_user")

  // If trying to access protected route without auth, redirect to login
  if (!isPublicRoute && !mockUser) {
    // In production with Supabase, check for actual session
    const supabaseToken = request.cookies.get("sb-access-token")

    if (!supabaseToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isPublicRoute && (mockUser || request.cookies.get("sb-access-token"))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes (API endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}
