export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductActions } from "@/components/store/ProductActions";
import { ProductTabs } from "@/components/store/ProductTabs";
import { ReviewList } from "@/components/store/ReviewList";
import { ReviewForm } from "@/components/store/ReviewForm";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Star, ShoppingBag, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { group: "asc" } },
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { orderItems: true } },
    },
  });
}

export async function generateMetadata({ params: paramsPromise }: ProductPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const product = await getProduct(params.slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params: paramsPromise }: ProductPageProps) {
  const params = await paramsPromise;
  const [product, session] = await Promise.all([
    getProduct(params.slug),
    getServerSession(authOptions),
  ]);
  if (!product) notFound();

  const discount = product.oldPrice
    ? calculateDiscount(product.price, product.oldPrice)
    : 0;

  // Review stats
  const reviews = product.reviews;
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
  const orderCount = product._count.orderItems;

  // Check if current user can leave review
  const userId = (session?.user as any)?.id as string | undefined;
  let hasOrdered = false;
  let alreadyReviewed = false;
  if (userId) {
    const [ordered, reviewed] = await Promise.all([
      prisma.orderItem.findFirst({
        where: {
          productId: product.id,
          order: { userId, status: { in: ["DELIVERED", "RETURNED"] } },
        },
      }),
      prisma.review.findUnique({
        where: { userId_productId: { userId, productId: product.id } },
      }),
    ]);
    hasOrdered = !!ordered;
    alreadyReviewed = !!reviewed;
  }

  // Only non-empty specs for quick preview
  const visibleSpecs = product.specs.filter((s) => s.name?.trim() && s.value?.trim());

  // Related products
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Главная</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/catalog" className="hover:text-blue-600">Каталог</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="flex flex-col">
          {product.brand && (
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
              {product.brand}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Rating + stats */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {reviewCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({reviewCount} отзывов)</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Нет отзывов</span>
            )}
            {orderCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{orderCount} заказов</span>
              </div>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-5">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                В наличии{product.stock <= 5 ? ` (осталось ${product.stock} шт.)` : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Нет в наличии
              </span>
            )}
            {product.sku && (
              <span className="ml-4 text-xs text-gray-400">Арт. {product.sku}</span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-sm font-bold rounded-md">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            {product.oldPrice && (
              <p className="text-sm text-green-600 font-medium mt-1">
                Вы экономите {formatPrice(product.oldPrice - product.price)}
              </p>
            )}
          </div>

          {/* Actions */}
          <ProductActions product={product as any} />

          {/* Quick specs preview (first 4 non-empty) */}
          {visibleSpecs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                {visibleSpecs.slice(0, 4).map((spec) => (
                  <div key={spec.id} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">{spec.name}</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description / Specs */}
      <ProductTabs description={product.description} specs={product.specs} />

      {/* Reviews */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Отзывы покупателей
          {reviewCount > 0 && (
            <span className="text-sm font-normal text-gray-400">({reviewCount})</span>
          )}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReviewList reviews={reviews} avgRating={avgRating} reviewCount={reviewCount} />
          <div>
            <ReviewForm
              productId={product.id}
              hasOrdered={hasOrdered}
              alreadyReviewed={alreadyReviewed}
            />
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Похожие товары</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => {
              const { ProductCard } = require("@/components/store/ProductCard");
              return <ProductCard key={p.id} product={p} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
