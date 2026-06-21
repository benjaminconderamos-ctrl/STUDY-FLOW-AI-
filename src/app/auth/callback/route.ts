import { createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.terms_version) {
        await supabase.from("legal_acceptances").insert({
          user_id: user.id,
          terms_version: user.user_metadata.terms_version as string,
          privacy_version: (user.user_metadata.privacy_version ?? user.user_metadata.terms_version) as string,
          user_agent: request.headers.get("user-agent") ?? null,
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth-callback] code exchange failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
