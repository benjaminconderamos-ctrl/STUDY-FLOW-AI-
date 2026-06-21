import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_BY_PRICE: Record<string, string> = {
  [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
  [process.env.STRIPE_MAX_PRICE_ID!]: "max",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe-webhook] firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      if (!userId || !plan) break;

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan,
        status: "active",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      await supabase.from("profiles").update({ plan }).eq("id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;

      const userId = sub.metadata?.user_id;
      const customerId = sub.customer as string;

      let resolvedUserId = userId;
      if (!resolvedUserId) {
        const { data } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();
        resolvedUserId = data?.user_id;
      }
      if (!resolvedUserId) break;

      const priceId = sub.items.data[0]?.price.id;
      const plan = PLAN_BY_PRICE[priceId] ?? "pro";
      const isActive = sub.status === "active";
      const status = isActive ? "active"
        : sub.status === "past_due" ? "past_due"
        : sub.status === "canceled" ? "canceled"
        : "inactive";

      await supabase.from("subscriptions").update({
        plan,
        status,
        current_period_end: new Date(((sub as unknown as Record<string, number>).current_period_end) * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("user_id", resolvedUserId);

      await supabase.from("profiles")
        .update({ plan: isActive ? plan : "free" })
        .eq("id", resolvedUserId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const { data } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      if (!data?.user_id) break;

      await supabase.from("subscriptions").update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      }).eq("user_id", data.user_id);

      await supabase.from("profiles").update({ plan: "free" }).eq("id", data.user_id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      if (!data?.user_id) break;

      await supabase.from("subscriptions").update({
        status: "past_due",
        updated_at: new Date().toISOString(),
      }).eq("user_id", data.user_id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
