import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug, image } = await request.json();

  if (!name || !slug) {
    return NextResponse.json({ error: "Название и slug обязательны" }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Категория с таким slug уже существует" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, slug, image },
  });

  return NextResponse.json(category);
}
