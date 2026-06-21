import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const termsVersion = (user.user_metadata?.terms_version as string | undefined) ?? "2026-06-20";
  const privacyVersion = (user.user_metadata?.privacy_version as string | undefined) ?? "2026-06-20";

  await supabase.from("legal_acceptances").insert({
    user_id: user.id,
    terms_version: termsVersion,
    privacy_version: privacyVersion,
  });

  return NextResponse.json({ ok: true });
}
