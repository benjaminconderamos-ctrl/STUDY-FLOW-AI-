"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { StudySession } from "@/types";

type ChatMessage = { role: "user" | "assistant"; content: string };

const welcomeMessage = (title: string): ChatMessage => ({
  role: "assistant",
  content: `Hola, soy tu tutor para "${title}". ¿Qué quieres entender mejor o tienes alguna duda?`,
});

export function TutorTab({ session }: { session: StudySession }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("tutor_messages")
        .select("role, content")
        .eq("session_id", session.id)
        .order("created_at"),
    ]).then(([{ data: authData }, { data: dbMessages }]) => {
      userIdRef.current = authData.user?.id ?? null;
      if (dbMessages && dbMessages.length > 0) {
        setMessages(dbMessages as ChatMessage[]);
      } else {
        setMessages([welcomeMessage(session.title)]);
      }
      setIsLoading(false);
    });
  }, [session.id, session.title]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;
    if (text.length > 800) {
      setError("Tu mensaje es demasiado largo (máx. 800 caracteres).");
      return;
    }

    setError("");
    setInput("");
    setIsSending(true);

    const newUserMessage: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);

    const supabase = createClient();
    const userId = userIdRef.current;

    if (userId) {
      await supabase.from("tutor_messages").insert({
        session_id: session.id,
        user_id: userId,
        role: "user",
        content: text,
      });
    }

    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          messages: newMessages.slice(-40),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          typeof data.error === "object" && data.error !== null
            ? (data.error.message ?? "Error al contactar al tutor.")
            : (data.error ?? "Error al contactar al tutor.");
        setError(message);
        setIsSending(false);
        return;
      }

      if (!response.body) {
        setError("No se pudo leer la respuesta.");
        setIsSending(false);
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((currentMessages) => {
          const updated = [...currentMessages];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return updated;
        });
      }

      if (userId && assistantContent) {
        await supabase.from("tutor_messages").insert({
          session_id: session.id,
          user_id: userId,
          role: "assistant",
          content: assistantContent,
        });
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando conversación...</span>
      </div>
    );
  }

  return (
    <div
      className="max-w-2xl flex flex-col"
      style={{ height: "calc(100vh - 340px)", minHeight: "400px" }}
    >
      {!session.summary && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-muted rounded-[8px]">
          <MessageCircle size={13} strokeWidth={1.5} className="text-foreground-muted flex-shrink-0" />
          <p className="text-[12px] text-foreground-muted font-sans">
            El tutor funciona mejor cuando tienes un resumen generado.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-[12px] px-4 py-2.5 text-[14px] leading-relaxed font-sans ${
                message.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              {message.content || (
                <span className="flex items-center gap-1.5 text-foreground-muted">
                  <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
                  <span className="text-[13px]">Escribiendo...</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p className="text-[12px] text-red-500 font-sans mb-2">{error}</p>
      )}

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta..."
          maxLength={800}
          disabled={isSending}
          className="flex-1 h-10 px-3 text-[14px] font-sans bg-card border border-border rounded-[10px] text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted transition-colors duration-150 disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-foreground text-background hover:opacity-80 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Enviar"
        >
          {isSending ? (
            <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <Send size={15} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}
