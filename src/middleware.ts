import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Light-weight JWT decoder for browser/edge runtime
function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const PUBLIC_PATHS = ["/", "/login", "/forgot-password", "/reset-password", "/2fa", "/terms", "/privacy"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets, images, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check for access token
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 3. If on a protected path (e.g. /dashboard)
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3.1. HARDENED: Protect Superadmin Route
    if (pathname.startsWith("/dashboard/superadmin")) {
      if (!accessToken) {
         return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      
      const payload = decodeJwt(accessToken);
      if (!payload || payload.role !== "superadmin") {
         console.warn("Unauthorized access attempt to Superadmin hub by:", payload?.email);
         return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    
    return NextResponse.next();
  }

  // 4. If on login/reset paths and already have a token, redirect to dashboard
  if (accessToken && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
