import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — get or create chat for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  let chat = await prisma.supportChat.findFirst({
    where: { userId: user.id, status: "open" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat) {
    chat = await prisma.supportChat.create({
      data: { userId: user.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  return NextResponse.json(chat);
}

// POST — send message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  const { content, chatId } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });

  // Verify chat belongs to user
  const chat = await prisma.supportChat.findFirst({ where: { id: chatId, userId: user.id } });
  if (!chat) return NextResponse.json({ error: "Чат не найден" }, { status: 404 });

  const message = await prisma.supportMessage.create({
    data: { chatId, content: content.trim(), isAdmin: false },
  });

  await prisma.supportChat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });

  return NextResponse.json(message);
}
