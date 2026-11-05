import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/constants";

export const getSession = cache(async () => {
  if (!(await cookies()).has(AUTH_COOKIE)) return null;
  try {
    return await apiFetch("/auth/me/");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error; // Django down etc. is handled by error.js
  }
});

export async function verifySession() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}