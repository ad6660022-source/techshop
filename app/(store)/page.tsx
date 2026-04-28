export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ArrowRight, Zap, Truck, Shield, RotateCcw, MessageCircle } from "lucide-react";

function withRating<T extends { reviews: { rating: number }[]; _count: { orderItems: number } }>(
  products: T[]
) {
  return products.map((p) => ({
    ...p,
    reviewCount: p.reviews.length,
    avgRating:
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 0,
    orderCount: p._count.orderItems,
  }));
}

const PRODUCT_INCLUDE = {
  images: { orderBy: { sortOrder: "asc" as const }, take: 3 },
  category: true,
  reviews: { select: { rating: true } },
  _count: { select: { orderItems: true } },
} as const;

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: PRODUCT_INCLUDE,
    take: 4,
  });
  return withRating(products);
}

async function getNewProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: PRODUCT_INCLUDE,
    take: 4,
  });
  return withRating(products);
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

const BENEFITS = [
  {
    icon: Truck,
    title: "Быстрая доставка",
    desc: "По всей России за 1–3 дня",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    desc: "Оригиналы с официальной гарантией",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: RotateCcw,
    title: "Возврат 14 дней",
    desc: "Без вопросов и лишних условий",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MessageCircle,
    title: "Заказ в мессенджерах",
    desc: "Telegram, VK, WhatsApp и другие",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default async function HomePage() {
  const [featured, newProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#09090f] py-24 px-4">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08)_0%,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full spark-pulse" />
              Новинки уже в наличии
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6 text-white">
              Техника,{" "}
              <span className="gradient-text">которая</span>
              <br />
              <span className="gradient-text">заряжает</span>
            </h1>

            <p className="text-lg text-[#7c7c99] mb-10 leading-relaxed max-w-lg">
              Смартфоны, ноутбуки, наушники от ведущих брендов.
              Заказ через мессенджер — быстро и без лишних шагов.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 h-12 px-6 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/50 hover:shadow-violet-700/60"
              >
                Перейти в каталог
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog?featured=true"
                className="inline-flex items-center gap-2 h-12 px-6 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Хиты продаж
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: "10 000+", label: "товаров" },
                { value: "50 000+", label: "клиентов" },
                { value: "4.9", label: "рейтинг" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-sm text-[#7c7c99]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Benefits */}
      <section className="bg-[#111119] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.bg}`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{b.title}</h3>
                  <p className="text-xs text-[#7c7c99] mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Категории</h2>
            <p className="text-sm text-[#7c7c99] mt-1">Выберите нужное направление</p>
          </div>
          <Link href="/catalog" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            Все категории <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col bg-[#111119] rounded-2xl border border-white/8 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/20 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-36 bg-[#1c1c28]">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-5xl opacity-70">
                    {cat.icon || "📦"}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm group-hover:text-violet-300 transition-colors">{cat.name}</h3>
                <p className="text-xs text-[#7c7c99] mt-1">{cat._count.products} товаров</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-[#111119] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Хиты продаж</h2>
                <p className="text-sm text-[#7c7c99] mt-1">Самые популярные товары</p>
              </div>
              <Link href="/catalog?featured=true" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                Смотреть все <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-900/60 to-[#1c1c28] rounded-2xl border border-violet-500/20 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs text-violet-300 mb-4">
                <Zap className="w-3 h-3 text-amber-400" fill="currentColor" />
                Специальное предложение
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Скидка 10% на первый заказ</h3>
              <p className="text-[#7c7c99]">
                Промокод:{" "}
                <span className="font-bold text-white font-mono bg-white/10 px-2 py-0.5 rounded-lg text-sm">ИСКРА10</span>
              </p>
            </div>
            <Link
              href="/catalog"
              className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-6 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/40"
            >
              Выбрать товары
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Новинки</h2>
              <p className="text-sm text-[#7c7c99] mt-1">Только что поступили в продажу</p>
            </div>
            <Link href="/catalog?isNew=true" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              Все новинки <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
