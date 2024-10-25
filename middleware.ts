import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (session && request.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/"],
}
