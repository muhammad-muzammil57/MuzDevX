import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminListBlogPosts, adminCreateBlogPost } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";
import type { AdminBlogPostInput } from "@/types/admin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const posts = await adminListBlogPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as AdminBlogPostInput;
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Title, slug and content are required." }, { status: 400 });
    }
    const post = await adminCreateBlogPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
