import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  max: process.env.STRIPE_MAX_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { plan, coupon } = await req.json() as { plan?: string; coupon?: string };

  if (!plan || !PRICE_IDS[plan]) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (coupon) {
    const promoCodes = await stripe.promotionCodes.list({
      code: coupon.trim().toUpperCase(),
      active: true,
      limit: 1,
    });
    if (promoCodes.data.length > 0) {
      discounts = [{ promotion_code: promoCodes.data[0].id }];
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: sub?.stripe_customer_id ?? undefined,
    customer_email: sub?.stripe_customer_id ? undefined : (user.email ?? undefined),
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    ...(discounts ? { discounts } : { allow_promotion_codes: true }),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#precios`,
    metadata: { user_id: user.id, plan },
    subscription_data: { metadata: { user_id: user.id, plan } },
  });

  return NextResponse.json({ url: session.url });
}
