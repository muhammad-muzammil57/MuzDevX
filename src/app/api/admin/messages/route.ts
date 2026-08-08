import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminListMessages } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const messages = await adminListMessages();
    return NextResponse.json({ messages });
  } catch (err) {
    return errorResponse(err);
  }
}
