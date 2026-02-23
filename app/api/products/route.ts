import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock");
  const featured = searchParams.get("featured");
  const isNew = searchParams.get("isNew");
  const sort = searchParams.get("sort") || "newest";

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(search && {
      OR: [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(brand && { brand }),
    ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
    ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    ...(inStock === "true" && { stock: { gt: 0 } }),
    ...(featured === "true" && { isFeatured: true }),
    ...(isNew === "true" && { isNew: true }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "popular"
      ? { orderItems: { _count: "desc" } }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { orderItems: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
