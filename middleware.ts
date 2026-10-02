import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "tn78_auth_token";
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const ALLOWED_DEV_HOST_PATTERNS = [
  /^localhost(:\d+)?$/,
  /^127\.0\.0\.1(:\d+)?$/,
  /^.*\.ngrok-free\.dev$/,
  /^.*\.ngrok-free\.app$/,
  /^.*\.ngrok\.io$/,
  /^.*\.devtunnels\.ms$/,
  /^.*\.app\.github\.dev$/,
  /^.*\.github\.dev$/,
  /^.*\.loca\.lt$/,
  /^.*\.pinggy\.link$/,
  /^pumice-clatter-bottling\.ngrok-free\.dev$/,
];

/**
 * Validates request Origin / Referer to defend against Cross-Site Request Forgery (CSRF).
 */
function isSameOriginOrAllowed(request: NextRequest): boolean {
  // If browser Sec-Fetch-Site indicates a cross-site request, reject immediately
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  const forwardedHost = request.headers.get("x-forwarded-host");

  const source = origin || referer;
  if (!source) {
    return false;
  }

  try {
    const sourceUrl = new URL(source);
    const sourceHost = sourceUrl.host;

    // Check direct match with Host or X-Forwarded-Host (admin proxy)
    if (host && (sourceHost === host || sourceHost.split(":")[0] === host.split(":")[0])) {
      return true;
    }
    if (forwardedHost && (sourceHost === forwardedHost || sourceHost.split(":")[0] === forwardedHost.split(":")[0])) {
      return true;
    }

    // In development mode, check against known allowed tunnel origins
    if (process.env.NODE_ENV !== "production") {
      if (ALLOWED_DEV_HOST_PATTERNS.some((pattern) => pattern.test(sourceHost))) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Validate JWT structure and expiry without external dependencies.
 */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    // If expiration claim is present, verify token has not expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. CSRF Protection for state-changing API endpoints
  if (pathname.startsWith("/api/")) {
    const isWebhook = pathname === "/api/v1/payments/webhook";

    // Enforce strict CSRF origin validation on state-changing requests carrying auth cookies or session/upload mutations
    if (
      STATE_CHANGING_METHODS.has(method) &&
      !isWebhook &&
      (token || pathname === "/api/auth/session" || pathname === "/api/upload")
    ) {
      if (!isSameOriginOrAllowed(request)) {
        return NextResponse.json(
          { error: "Forbidden: Cross-site request rejected (CSRF protection)." },
          { status: 403 }
        );
      }
    }

    // Forward Bearer token from HttpOnly cookie to FastAPI backend via rewrites
    if (pathname.startsWith("/api/v1/")) {
      const requestHeaders = new Headers(request.headers);
      if (token && !requestHeaders.has("authorization")) {
        requestHeaders.set("authorization", `Bearer ${token}`);
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    }

    return NextResponse.next();
  }

  // 2. Server-side /admin route protection
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLoginPage = pathname === "/admin/login";
    const hasValidSession = Boolean(token && isTokenValid(token));

    // Unauthenticated access to protected admin route -> redirect server-side to /admin/login
    if (!hasValidSession) {
      if (!isLoginPage) {
        const loginUrl = new URL("/admin/login", request.url);
        if (pathname !== "/admin") {
          loginUrl.searchParams.set("redirect", pathname);
        }
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    // Authenticated user attempting to access /admin/login -> redirect to /admin or target
    if (isLoginPage) {
      const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/admin";
      const safeTarget =
        redirectTarget.startsWith("/admin") && redirectTarget !== "/admin/login"
          ? redirectTarget
          : "/admin";
      return NextResponse.redirect(new URL(safeTarget, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin",
    "/admin/:path*",
  ],
};


