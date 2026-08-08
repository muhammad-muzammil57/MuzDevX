import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminGetStats } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const stats = await adminGetStats();
    return NextResponse.json({ stats });
  } catch (err) {
    return errorResponse(err);
  }
}
