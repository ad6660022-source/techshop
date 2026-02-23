import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const {
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    deliveryCost,
    promoCodeId,
    discount,
    notes,
    items,
  } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  // Verify products and calculate total
  let total = 0;
  const orderItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: `Товар недоступен: ${item.productId}` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Недостаточно товара: ${product.name}` }, { status: 400 });
    }
    total += product.price * item.quantity;
    orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
  }

  const finalTotal = total + (deliveryCost || 0) - (discount || 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session ? (session.user as any).id : null,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress: deliveryAddress || "",
      subtotal: total,
      total: finalTotal,
      deliveryCost: deliveryCost || 0,
      discount: discount || 0,
      promoCodeId: promoCodeId || null,
      notes,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
    },
  });

  // Increment promo usage
  if (promoCodeId) {
    await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: { usedCount: { increment: 1 } },
    });
  }

  // Decrease stock
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return NextResponse.json(order);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = (session.user as any).role === "ADMIN";
  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: { take: 1 } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
