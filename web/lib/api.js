import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.detail ?? `API request failed (${status})`);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(path, { auth = true, headers, ...init } = {}) {
  const token = auth ? (await cookies()).get(AUTH_COOKIE)?.value : null;

  const response = await fetch(`${process.env.API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}