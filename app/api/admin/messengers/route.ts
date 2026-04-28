import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messengers = await prisma.messenger.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(messengers);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, name, link, isActive, sortOrder } = body;

  if (!type || !name || !link) {
    return NextResponse.json({ error: "type, name и link обязательны" }, { status: 400 });
  }

  const messenger = await prisma.messenger.create({
    data: { type, name, link, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(messenger, { status: 201 });
}
