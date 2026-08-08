"use client";

import { supabase } from "@/lib/supabase";

/**
 * Like fetch(), but automatically attaches the signed-in admin's Supabase
 * access token so /api/admin/* routes can verify the request server-side.
 * Throws a readable Error if the response isn't ok.
 */
export async function adminFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || `Request failed (${res.status})`);
  }
  return json as T;
}
