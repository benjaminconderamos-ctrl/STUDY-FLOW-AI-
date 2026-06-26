import { createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createServerClient();

  // Recovery flow: pass token to client so the browser establishes the session
  if (token_hash && type === "recovery") {
    return NextResponse.redirect(
      `${origin}/reset-password?token_hash=${token_hash}&type=${type}`
    );
  }

  // Other email-based flows (magic link, email confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth-callback] token verification failed:", error.message);
  }

  // OAuth / PKCE flows
  if (code) {
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
