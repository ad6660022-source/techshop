import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { status, paymentStatus } = await req.json();

    if (status) {
      const existing = await prisma.order.findUnique({
        where: { id: params.id },
        include: { items: true },
      });

      if (existing?.status === "CANCELLED") {
        return NextResponse.json({ error: "Нельзя изменить статус отменённого заказа" }, { status: 400 });
      }

      const PRE_SHIP = ["PENDING", "CONFIRMED", "PROCESSING"];

      // Admin cancels pre-ship order → restore stock
      if (status === "CANCELLED" && existing && PRE_SHIP.includes(existing.status)) {
        for (const item of existing.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // Item returned to warehouse → restore stock
      if (status === "RETURNED" && existing?.status === "RETURNING") {
        for (const item of existing.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
