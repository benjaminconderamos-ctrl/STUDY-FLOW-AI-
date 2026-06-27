import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const REPORT_EMAIL = "studyflowai122@gmail.com";

function err(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("No autenticado.", 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return err("Cuerpo inválido.", 400);
  }

  const description = body.description;
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return err("La descripción es requerida.", 400);
  }
  if (description.length > 2000) {
    return err("La descripción no puede superar 2000 caracteres.", 400);
  }

  const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl : "—";

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, plan")
    .eq("id", user.id)
    .single();

  const name = profile?.name ?? "Usuario";
  const plan = profile?.plan ?? "free";
  const email = user.email ?? "—";

  const date = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "short",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; color: #16120F;">
      <h2 style="margin-bottom: 4px;">🐛 Reporte de problema — Beta</h2>
      <p style="color: #6F6962; font-size: 13px; margin-top: 0;">${date}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #6F6962; width: 90px;">Usuario</td>
          <td style="padding: 6px 0; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6F6962;">Email</td>
          <td style="padding: 6px 0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6F6962;">Plan</td>
          <td style="padding: 6px 0; text-transform: uppercase; font-weight: 600;">${plan}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6F6962;">Página</td>
          <td style="padding: 6px 0; word-break: break-all;">${pageUrl}</td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #DED8CF; margin: 16px 0;" />

      <h3 style="font-size: 14px; color: #6F6962; margin-bottom: 8px;">Descripción</h3>
      <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap; background: #F7F4EE; padding: 12px 16px; border-radius: 8px; margin: 0;">${description.trim()}</p>
    </div>
  `;

  const { error: sendError } = await resend.emails.send({
    from: "StudyFlow AI <noreply@studyflowai.net>",
    to: REPORT_EMAIL,
    subject: `[Beta] Reporte de problema — ${email}`,
    html,
  });

  if (sendError) {
    console.error("[report-bug] resend error", sendError);
    return err("No se pudo enviar el reporte. Intenta de nuevo.", 500);
  }

  return NextResponse.json({ ok: true });
}
