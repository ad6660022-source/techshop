import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/promo]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
