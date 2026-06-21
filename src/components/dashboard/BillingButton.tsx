"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function BillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
    const { url, error } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      console.error("Portal error:", error);
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleManage} disabled={loading}>
      {loading ? "Cargando..." : "Gestionar suscripción"}
    </Button>
  );
}
