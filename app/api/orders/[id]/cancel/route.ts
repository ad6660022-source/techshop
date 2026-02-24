import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  if (order.userId !== user.id) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return NextResponse.json(
      { error: "Заказ нельзя отменить — он уже отправлен или доставлен" },
      { status: 400 }
    );
  }

  const needsRefund = order.paymentStatus === "PAID";

  // Cancel order; if paid — keep paymentStatus=PAID so admin sees refund is needed
  await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  // Restore product stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }

  return NextResponse.json({ success: true, needsRefund });
}
