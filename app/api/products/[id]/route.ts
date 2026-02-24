import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { id: "asc" } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { images, specs, ...productData } = body;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...productData,
      ...(images && {
        images: {
          deleteMany: {},
          create: images.map((img: any, i: number) => ({
            url: img.url,
            alt: img.alt || "",
            sortOrder: i,
          })),
        },
      }),
      ...(specs && {
        specs: {
          deleteMany: {},
          create: specs.map((s: any) => ({
            name: s.name,
            value: s.value,
            group: s.group || "Основные",
          })),
        },
      }),
    },
    include: {
      images: true,
      specs: true,
      category: true,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft delete
  await prisma.product.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
