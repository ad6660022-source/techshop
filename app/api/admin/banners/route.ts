import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, subtitle, imageUrl, videoUrl, linkUrl, linkLabel, isActive, sortOrder } = body;
  if (!imageUrl && !videoUrl) {
    return NextResponse.json({ error: "Нужна картинка или видео" }, { status: 400 });
  }
  const banner = await prisma.banner.create({
    data: { title, subtitle, imageUrl, videoUrl, linkUrl, linkLabel, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(banner, { status: 201 });
}
