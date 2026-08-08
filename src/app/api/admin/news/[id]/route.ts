import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminGetNews, adminUpdateNews, adminDeleteNews } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";
import type { AdminNewsArticleInput } from "@/types/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    const article = await adminGetNews(id);
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    const body = (await req.json()) as AdminNewsArticleInput;
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Title, slug and content are required." }, { status: 400 });
    }
    const article = await adminUpdateNews(id, body);
    return NextResponse.json({ article });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    await adminDeleteNews(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
