import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, error: "Ingresa un código" });
  }

  try {
    const promoCodes = await stripe.promotionCodes.list({ code, active: true, limit: 1 });

    if (!promoCodes.data.length) {
      return NextResponse.json({ valid: false, error: "Cupón inválido o expirado" });
    }

    const promo = promoCodes.data[0];
    const couponObj = promo.promotion?.coupon;
    const coupon = typeof couponObj === "object" && couponObj !== null ? couponObj : null;

    let discountText = "Descuento aplicado";
    if (coupon && "percent_off" in coupon && coupon.percent_off) {
      discountText = `${coupon.percent_off}% de descuento`;
    } else if (coupon && "amount_off" in coupon && coupon.amount_off) {
      const amount = (coupon.amount_off / 100).toFixed(0);
      discountText = `$${amount} MXN de descuento`;
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountText,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Error al validar el cupón" });
  }
}
