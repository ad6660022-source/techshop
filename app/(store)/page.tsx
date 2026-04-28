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
    iconBg: "bg-[#ede5d2]",
    iconColor: "text-[#6b4c2a]",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    desc: "Только оригиналы с гарантией",
    iconBg: "bg-[#e8f0e8]",
    iconColor: "text-[#3d7a4a]",
  },
  {
    icon: RotateCcw,
    title: "Возврат 14 дней",
    desc: "Без вопросов и условий",
    iconBg: "bg-[#fdf0ec]",
    iconColor: "text-[#9b3a2a]",
  },
  {
    icon: MessageCircle,
    title: "Заказ в мессенджерах",
    desc: "Telegram, VK, WhatsApp и другие",
    iconBg: "bg-[#f0ede8]",
    iconColor: "text-[#b8721e]",
  },
];

export default async function HomePage() {
  const [featured, newProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
  ]);

  return (
    <div className="bg-[#faf8f3]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#241a0c]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(184,114,30,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(107,76,42,0.20)_0%,transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#b8721e]/20 border border-[#b8721e]/30 rounded-full px-4 py-1.5 text-[13px] text-[#d4904a] mb-8">
              <Zap className="w-3.5 h-3.5 text-[#d4904a]" fill="currentColor" />
              Новинки уже в наличии
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-white mb-6">
              Техника,{" "}
              <span className="text-[#d4904a]">которая</span>
              <br />
              <span className="text-[#d4904a]">работает</span>
            </h1>

            <p className="text-[16px] text-[#8a6e48] mb-10 leading-relaxed">
              Смартфоны, ноутбуки, наушники от ведущих брендов.
              Заказ через мессенджер — просто и быстро.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 h-12 px-6 bg-[#b8721e] text-white font-bold rounded-xl hover:bg-[#9e6118] transition-all shadow-[0_4px_16px_rgba(184,114,30,0.40)] hover:shadow-[0_6px_22px_rgba(184,114,30,0.50)] text-[15px]"
              >
                Перейти в каталог
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog?featured=true"
                className="inline-flex items-center gap-2 h-12 px-6 bg-white/8 text-[#e8d4b4] font-semibold rounded-xl hover:bg-white/14 transition-all border border-white/15 hover:border-white/25 text-[15px]"
              >
                Хиты продаж
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/8">
              {[
                { value: "10 000+", label: "товаров" },
                { value: "50 000+", label: "клиентов" },
                { value: "4.9 ★", label: "средний рейтинг" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[22px] font-black text-white">{s.value}</p>
                  <p className="text-[13px] text-[#8a6e48]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-[#f3ede0] border-b border-[#d4c4a4]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.iconBg}`}>
                  <b.icon className={`w-5 h-5 ${b.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-[#241a0c]">{b.title}</h3>
                  <p className="text-[12px] text-[#8a6e48] mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-[22px] font-bold text-[#241a0c]">Категории</h2>
            <p className="text-[13px] text-[#8a6e48] mt-0.5">Выберите нужное направление</p>
          </div>
          <Link href="/catalog" className="text-[13px] text-[#b8721e] hover:text-[#9e6118] font-medium flex items-center gap-1 transition-colors">
            Все категории <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-[#e4d9c4] hover:border-[#c4a87a] hover:shadow-[0_4px_16px_rgba(100,72,32,0.10)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-36 bg-[#f3ede0]">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-5xl">
                    {cat.icon || "📦"}
                  </div>
                )}
              </div>
              <div className="px-4 py-3.5">
                <h3 className="font-semibold text-[#241a0c] text-[13.5px] group-hover:text-[#6b4c2a] transition-colors">{cat.name}</h3>
                <p className="text-[12px] text-[#8a6e48] mt-0.5">{cat._count.products} товаров</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-[#f3ede0] border-y border-[#d4c4a4]">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-[22px] font-bold text-[#241a0c]">Хиты продаж</h2>
                <p className="text-[13px] text-[#8a6e48] mt-0.5">Самые популярные товары</p>
              </div>
              <Link href="/catalog?featured=true" className="text-[13px] text-[#b8721e] hover:text-[#9e6118] font-medium flex items-center gap-1 transition-colors">
                Смотреть все <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="relative overflow-hidden bg-[#6b4c2a] rounded-2xl p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8721e]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[#c4a87a] text-[13px] font-semibold mb-2 uppercase tracking-wider">Специальное предложение</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Скидка 10% на первый заказ</h3>
              <p className="text-[#c4a87a] text-[14px]">
                Промокод:{" "}
                <span className="font-bold text-white font-mono bg-white/15 px-2.5 py-1 rounded-lg">ИСКРА10</span>
              </p>
            </div>
            <Link
              href="/catalog"
              className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-6 bg-[#b8721e] text-white font-bold rounded-xl hover:bg-[#9e6118] transition-all shadow-[0_4px_16px_rgba(184,114,30,0.40)] text-[15px]"
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
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-[22px] font-bold text-[#241a0c]">Новинки</h2>
              <p className="text-[13px] text-[#8a6e48] mt-0.5">Только что поступили в продажу</p>
            </div>
            <Link href="/catalog?isNew=true" className="text-[13px] text-[#b8721e] hover:text-[#9e6118] font-medium flex items-center gap-1 transition-colors">
              Все новинки <ArrowRight className="w-3.5 h-3.5" />
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
