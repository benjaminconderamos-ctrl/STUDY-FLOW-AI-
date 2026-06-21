// TODO: Implementar checkout de Stripe
// Flujo esperado:
// 1. Autenticar usuario (supabase.auth.getUser())
// 2. Validar el plan solicitado ('pro' | 'max')
// 3. Crear o recuperar stripe_customer_id de la tabla subscriptions
// 4. Crear Stripe Checkout Session con el price_id correspondiente
// 5. Retornar { url: checkoutSession.url }
//
// Variables de entorno necesarias:
// - STRIPE_SECRET_KEY
// - STRIPE_PRO_PRICE_ID
// - STRIPE_MAX_PRICE_ID
// - NEXT_PUBLIC_APP_URL
//
// Referencia: https://stripe.com/docs/checkout/quickstart
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: { code: "not_implemented", message: "Pagos no disponibles aún. Próximamente." } },
    { status: 501 }
  );
}
