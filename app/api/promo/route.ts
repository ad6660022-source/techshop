import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Код не указан" }, { status: 400 });
  }

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promo) {
    return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
  }

  if (!promo.isActive) {
    return NextResponse.json({ error: "Промокод неактивен" }, { status: 400 });
  }

  if (promo.expiresAt && new Date() > promo.expiresAt) {
    return NextResponse.json({ error: "Промокод истёк" }, { status: 400 });
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ error: "Лимит использований исчерпан" }, { status: 400 });
  }

  if (promo.minOrder && orderTotal < promo.minOrder) {
    return NextResponse.json(
      { error: `Минимальная сумма заказа: ${promo.minOrder} ₽` },
      { status: 400 }
    );
  }

  let discount = 0;
  if (promo.type === "PERCENTAGE") {
    discount = Math.round((orderTotal * promo.value) / 100);
  } else {
    discount = Math.min(promo.value, orderTotal);
  }

  return NextResponse.json({
    id: promo.id,
    code: promo.code,
    discountType: promo.type,
    discountValue: promo.value,
    discount,
  });
}
