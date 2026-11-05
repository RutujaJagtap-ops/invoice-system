import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError, apiFetch } from "@/lib/api";
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE } from "@/lib/constants";
import { validateLogin } from "@/lib/validators/auth";

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));

  const errors = validateLogin({ username, password });
  if (Object.keys(errors).length)
    return NextResponse.json({ errors }, { status: 400 });

  try {
    const { access } = await apiFetch("/auth/token/", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ username, password }),
    });

    (await cookies()).set(AUTH_COOKIE, access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json(
        { errors: { form: "Invalid username or password" } },
        { status: 401 },
      );
    }
    console.error("Login failed:", error);
    return NextResponse.json(
      { errors: { form: "Server unavailable. Try again shortly." } },
      { status: 502 },
    );
  }
}
