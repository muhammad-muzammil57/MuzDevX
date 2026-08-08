import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const client = getServiceClient();
  if (!client) {
    // ⚠️ REPLACE_ME: once Supabase env vars are set this branch won't run —
    // until then we just log so the form doesn't crash locally.
    console.log("Contact form (Supabase not configured yet):", body);
    return NextResponse.json({ ok: true });
  }

  const { error } = await client
    .from("contact_messages")
    .insert([{ name, email, subject: subject ?? "", message }]);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
