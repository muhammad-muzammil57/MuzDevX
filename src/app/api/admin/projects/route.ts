import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminListProjects, adminCreateProject } from "@/lib/admin-db";
import { errorResponse } from "@/lib/api-helpers";
import type { AdminProjectInput } from "@/types/admin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const projects = await adminListProjects();
    return NextResponse.json({ projects });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  try {
    const body = (await req.json()) as AdminProjectInput;
    if (!body.title || !body.slug || !body.shortDescription || !body.description) {
      return NextResponse.json({ error: "Title, slug, short description and description are required." }, { status: 400 });
    }
    const project = await adminCreateProject(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
