import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function GET(request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 50);

  try {
    const { results } = await apiFetch(`/clients/?${new URLSearchParams({ search: query, page_size: "8" })}`);
    return NextResponse.json(results.map(({ id, name, email }) => ({ id, name, email })));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Client search failed:", error);
    return NextResponse.json({ error: "Search unavailable" }, { status: 502 });
  }
}