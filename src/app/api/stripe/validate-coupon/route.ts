import { NextRequest, NextResponse } from "next/server";

// Local coupon codes defined via env var (comma-separated), e.g. LAUNCH6M,STUDYFLOW
const LOCAL_CODES = (process.env.LAUNCH_COUPON_CODES ?? "")
  .split(",")
  .map((c) => c.trim().toUpperCase())
  .filter(Boolean);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, error: "Ingresa un código" });
  }

  // Check local codes first (no Stripe required)
  if (LOCAL_CODES.includes(code)) {
    return NextResponse.json({
      valid: true,
      code,
      discountText: "Precio de lanzamiento por 6 meses",
    });
  }

  // Fall back to Stripe if configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ valid: false, error: "Cupón inválido o expirado" });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      name: (coupon && "name" in coupon ? coupon.name : null) ?? promo.code,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Error al validar el cupón" });
  }
}
