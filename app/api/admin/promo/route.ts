import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = await req.json();
    const { code, description, type, value, minOrder, maxUses, expiresAt } = body;

    if (!code || !value) {
      return NextResponse.json({ error: "Код и скидка обязательны" }, { status: 400 });
    }

    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Промокод с таким кодом уже существует" }, { status: 409 });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase().trim(),
        description,
        type: type || "PERCENTAGE",
        value: parseFloat(value),
        minOrder: parseFloat(minOrder) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
