import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth callback route should always be accessible
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/", "/about", "/features", "/pricing", "/contact"]
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // If user is not signed in and the current path requires authentication,
  // redirect the user to /login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is signed in and the current path is /login or /register,
  // redirect the user to /dashboard
  if (session && ["/login", "/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
