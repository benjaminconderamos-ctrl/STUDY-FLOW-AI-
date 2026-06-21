// TODO: Implementar portal de cliente de Stripe
// Permite al usuario gestionar su suscripción (cancelar, actualizar método de pago).
// Flujo esperado:
// 1. Autenticar usuario (supabase.auth.getUser())
// 2. Obtener stripe_customer_id de la tabla subscriptions
// 3. Crear portal session con stripe.billingPortal.sessions.create()
// 4. Retornar { url: portalSession.url }
//
// Variables de entorno necesarias:
// - STRIPE_SECRET_KEY
// - NEXT_PUBLIC_APP_URL
//
// Referencia: https://stripe.com/docs/customer-management
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: { code: "not_implemented", message: "Portal de suscripción no disponible aún." } },
    { status: 501 }
  );
}
