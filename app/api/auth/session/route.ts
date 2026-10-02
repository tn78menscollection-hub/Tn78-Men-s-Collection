import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "tn78_auth_token";
const INDICATOR_COOKIE_NAME = "tn78_has_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * POST /api/auth/session: Store JWT in a secure HttpOnly cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Valid authentication token is required." },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ success: true });

    // 1. Sensitive JWT Access Token in secure HttpOnly cookie (inaccessible to JS)
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    // 2. Non-sensitive indicator cookie for client-side state detection
    res.cookies.set({
      name: INDICATOR_COOKIE_NAME,
      value: "1",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to establish session.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session: Revoke session and clear cookies.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set({
    name: INDICATOR_COOKIE_NAME,
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

/**
 * GET /api/auth/session: Lightweight session status check.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  return NextResponse.json({
    authenticated: Boolean(token),
  });
}
