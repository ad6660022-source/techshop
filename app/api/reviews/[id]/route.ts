import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/reviews/[id] — admin reply
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { adminReply } = await req.json();

  if (!adminReply?.trim()) {
    return NextResponse.json({ error: "Ответ не может быть пустым" }, { status: 400 });
  }

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { adminReply: adminReply.trim(), isAutoReply: false },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(review);
}
