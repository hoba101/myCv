import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "./app/lib/auth";

/**
 * Guards /dashboard before any route renders.
 *
 * The layout redirect alone is not enough: pages that call `connection()`
 * stream concurrently, so the dashboard HTML was flushed into the response
 * body alongside the redirect. This runs first and never renders it at all.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE.name)?.value;

  if (isValidSessionToken(token)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/dashboard/login", request.url));
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};