import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

export function proxy(request) {
  if (request.cookies.has(AUTH_COOKIE)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*", "/clients/:path*"],
};