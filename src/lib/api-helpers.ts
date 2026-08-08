import { NextResponse } from "next/server";

export function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong.";
  // Postgres unique_violation (e.g. duplicate slug)
  const code = (err as { code?: string } | undefined)?.code;
  if (code === "23505") {
    return NextResponse.json(
      { error: "That slug is already in use — please choose a different one." },
      { status: 409 }
    );
  }
  console.error(err);
  return NextResponse.json({ error: message }, { status: 500 });
}
