import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

const VALID_GOALS = ["understand", "exam", "memorize", "review"];
const VALID_LEVELS = ["basic", "intermediate", "advanced"];

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("unauthorized", "No autenticado.", 401);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return err("invalid_body", "Cuerpo de la solicitud inválido.", 400);
  }

  const file = formData.get("file") as File | null;
  const goal = (formData.get("goal") as string) || "understand";
  const level = (formData.get("level") as string) || "intermediate";
  const subjectId = (formData.get("subjectId") as string) || null;

  if (!file) return err("missing_file", "No se recibió ningún archivo.", 400);
  if (file.type !== "application/pdf")
    return err("invalid_type", "Solo se aceptan archivos PDF.", 400);
  if (file.size > 20 * 1024 * 1024)
    return err("file_too_large", "El archivo no puede superar 20 MB.", 400);
  if (!VALID_GOALS.includes(goal))
    return err("invalid_goal", "Objetivo inválido.", 400);
  if (!VALID_LEVELS.includes(level))
    return err("invalid_level", "Nivel inválido.", 400);

  // Extract text from PDF
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let contentText = "";
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    contentText = result.text?.trim() ?? "";
  } catch (e) {
    console.error("[upload] pdf-parse error", e);
    return err(
      "parse_error",
      "No se pudo leer el PDF. Asegúrate de que no esté protegido con contraseña.",
      422
    );
  }

  if (!contentText) {
    return err(
      "empty_pdf",
      "El PDF no contiene texto extraíble. Prueba con otro archivo.",
      422
    );
  }

  // Upload raw file to Storage (best-effort — don't fail if storage errors)
  const storagePath = `${user.id}/${crypto.randomUUID()}.pdf`;
  let savedStoragePath: string | null = null;
  try {
    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, buffer, { contentType: "application/pdf" });
    if (!storageError) savedStoragePath = storagePath;
    else console.error("[upload] storage error", storageError.message);
  } catch (e) {
    console.error("[upload] storage exception", e);
  }

  // Save document record with extracted text
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      name: file.name,
      storage_path: savedStoragePath,
      size_bytes: file.size,
      type: "pdf",
      content_text: contentText.slice(0, 50000),
    })
    .select("id")
    .single();

  if (docError || !doc) {
    console.error("[upload] doc insert error", docError?.message);
    return err("internal_error", "Error al guardar el documento.", 500);
  }

  // Fetch subject name if provided
  let subjectName: string | null = null;
  if (subjectId) {
    const { data: subject } = await supabase
      .from("subjects")
      .select("name")
      .eq("id", subjectId)
      .eq("user_id", user.id)
      .single();
    subjectName = subject?.name ?? null;
  }

  // Create study session linked to the document
  const title = file.name.replace(/\.pdf$/i, "").slice(0, 300) || "Documento PDF";
  const { data: session, error: sessionError } = await supabase
    .from("study_sessions")
    .insert({
      user_id: user.id,
      document_id: doc.id,
      title,
      subject: subjectName,
      subject_id: subjectId ?? null,
      source: "pdf",
      goal,
      level,
      tools: ["summary"],
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    console.error("[upload] session insert error", sessionError?.message);
    return err("internal_error", "Error al crear la sesión.", 500);
  }

  return NextResponse.json({ sessionId: session.id });
}
