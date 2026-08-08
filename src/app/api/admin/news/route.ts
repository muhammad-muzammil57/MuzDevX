import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminListNews, adminCreateNews } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";
import type { AdminNewsArticleInput } from "@/types/admin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const articles = await adminListNews();
    return NextResponse.json({ articles });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as AdminNewsArticleInput;
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Title, slug and content are required." }, { status: 400 });
    }
    const article = await adminCreateNews(body);
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
