// TODO: Implementar webhook de Stripe
// IMPORTANTE: Siempre verificar la firma del webhook con stripe.webhooks.constructEvent()
// NUNCA confiar en el body sin verificar STRIPE_WEBHOOK_SECRET.
//
// Eventos a manejar:
// - checkout.session.completed → crear/actualizar subscriptions, actualizar profiles.plan
// - customer.subscription.updated → actualizar status, período, plan
// - customer.subscription.deleted → status='canceled', revertir profiles.plan a 'free'
// - invoice.payment_failed → status='past_due'
//
// Todas las actualizaciones a subscriptions deben hacerse con la service role key
// (supabaseAdmin), no con el cliente de usuario. La tabla subscriptions no tiene
// políticas RLS de INSERT/UPDATE para el cliente por diseño.
//
// Variables de entorno necesarias:
// - STRIPE_SECRET_KEY
// - STRIPE_WEBHOOK_SECRET  (Stripe Dashboard → Webhooks → Signing secret)
//
// Referencia: https://stripe.com/docs/webhooks
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: { code: "not_implemented", message: "Webhook no configurado." } },
    { status: 501 }
  );
}
