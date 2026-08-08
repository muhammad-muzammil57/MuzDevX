import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminGetProject, adminUpdateProject, adminDeleteProject } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";
import type { AdminProjectInput } from "@/types/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    const project = await adminGetProject(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    const body = (await req.json()) as AdminProjectInput;
    if (!body.title || !body.slug || !body.shortDescription || !body.description) {
      return NextResponse.json({ error: "Title, slug, short description and description are required." }, { status: 400 });
    }
    const project = await adminUpdateProject(id, body);
    return NextResponse.json({ project });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    await adminDeleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
