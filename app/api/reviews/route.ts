import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reviews?productId=xxx
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

const AUTO_REPLIES = [
  "Спасибо за вашу высокую оценку! Рады, что товар вам понравился. Ждём вас снова! 😊",
  "Благодарим за отличный отзыв! Ваше мнение очень важно для нас. До новых покупок! ⭐",
  "Спасибо за покупку и 5 звёзд! Рады были помочь. Желаем вам только лучшего! 🎉",
  "Отличная оценка — это лучшая награда для нас! Спасибо, что выбрали TechShop. 💙",
];

// POST /api/reviews
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { productId, rating, comment } = await req.json();

  if (!productId || !rating || !comment?.trim()) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Оценка должна быть от 1 до 5" }, { status: 400 });
  }

  // Check if user has a delivered order with this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["DELIVERED", "RETURNED"] },
      },
    },
  });

  if (!hasPurchased) {
    return NextResponse.json(
      { error: "Оставить отзыв могут только покупатели этого товара" },
      { status: 403 }
    );
  }

  // Check if user already reviewed this product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Вы уже оставляли отзыв на этот товар" },
      { status: 409 }
    );
  }

  const adminReply =
    rating === 5
      ? AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
      : null;

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment: comment.trim(),
      adminReply,
      isAutoReply: rating === 5,
    },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
