import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = await req.json();
    const { images, specs, ...data } = body;

    // Ensure unique slug
    let slug = data.slug;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        images: images
          ? {
              create: images.map((img: any, idx: number) => ({
                url: img.url,
                alt: img.alt || data.name,
                sortOrder: idx,
              })),
            }
          : undefined,
        specs: specs
          ? {
              create: specs.map((s: any) => ({
                name: s.name,
                value: s.value,
                group: s.group || "Основные",
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        specs: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/products]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
