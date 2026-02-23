export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    take: 4,
  });
}

async function getNewProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    take: 4,
  });
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
    desc: "Доставляем по всей России за 1-3 дня",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    desc: "Только оригинальные товары с официальной гарантией",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: RotateCcw,
    title: "Возврат 14 дней",
    desc: "Вернём деньги без вопросов, если что-то не так",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    desc: "Звоните или пишите в любое время",
    color: "text-purple-600 bg-purple-50",
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
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Новинки уже в наличии
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Техника
              <span className="text-blue-400"> нового</span>
              <br />
              поколения
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Смартфоны, ноутбуки, наушники и аксессуары от ведущих брендов.
              Официальная гарантия, быстрая доставка по всей России.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Перейти в каталог
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog?featured=true"
                className="inline-flex items-center gap-2 h-12 px-6 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Хиты продаж
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.color}`}>
                  <b.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{b.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
          <Link href="/catalog" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Все категории <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <div className="text-4xl mb-3">{cat.icon || "📦"}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {cat._count.products} товаров
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Хиты продаж</h2>
                <p className="text-sm text-gray-500 mt-1">Самые популярные товары</p>
              </div>
              <Link href="/catalog?featured=true" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Смотреть все <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-2">Специальное предложение</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Скидка 10% на первый заказ</h3>
            <p className="text-orange-100">Используйте промокод <span className="font-bold text-white bg-orange-400/40 px-2 py-0.5 rounded">WELCOME10</span></p>
          </div>
          <Link
            href="/catalog"
            className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-6 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors"
          >
            Выбрать товары
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Новинки</h2>
              <p className="text-sm text-gray-500 mt-1">Только что поступили в продажу</p>
            </div>
            <Link href="/catalog?isNew=true" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Все новинки <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
