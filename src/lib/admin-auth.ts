// Server-only. Verifies the Supabase access token the admin client sends on
// every /api/admin/* request (see src/lib/admin-client.ts) and returns the
// authenticated user, or null. Never import this file into a Client Component.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export async function getAdminUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  // A plain anon client is enough to validate a user's JWT against Supabase
  // Auth — this does not need (and must not use) the service role key.
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/** Shortcut for route handlers: returns the user, or an early 401 response. */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: User } | { response: NextResponse }> {
  const user = await getAdminUser(req);
  if (!user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user };
}
