import { NextRequest, NextResponse } from "next/server";
import { fetchFreeTests } from "@/lib/classplus";

// Same-origin proxy for the Free Tests page's client-side search/pagination.
// Keeps the Classplus hashkey out of the browser bundle and avoids a
// cross-origin fetch from the client straight to cms-gcp.classplusapp.com.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 20;
  const offset = Number(searchParams.get("offset")) || 0;
  const search = searchParams.get("search") ?? "";
  const folderId = searchParams.get("folderId") || undefined;

  const result = await fetchFreeTests({ limit, offset, search, folderId });
  return NextResponse.json(result);
}
