import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — all chats (admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const chats = await prisma.supportChat.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(chats);
}

// POST — admin reply
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { chatId, content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });

  const message = await prisma.supportMessage.create({
    data: { chatId, content: content.trim(), isAdmin: true },
  });

  await prisma.supportChat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });

  return NextResponse.json(message);
}
