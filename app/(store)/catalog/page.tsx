export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { CatalogFilters } from "@/components/store/CatalogFilters";
import type { Metadata } from "next";

type SearchParamsType = {
  category?: string;
  search?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  featured?: string;
  isNew?: string;
  sortBy?: string;
  page?: string;
};

interface CatalogPageProps {
  searchParams: Promise<SearchParamsType>;
}

export const metadata: Metadata = {
  title: "Каталог товаров",
  description: "Широкий выбор техники и электроники",
};

export const dynamic = "force-dynamic";

async function getProducts(sp: SearchParamsType) {
  const {
    category,
    search,
    brand,
    minPrice,
    maxPrice,
    inStock,
    featured,
    isNew,
    sortBy = "newest",
    page = "1",
  } = sp;

  const pageNum = parseInt(page);
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  const where: any = { isActive: true };
  if (category) where.category = { slug: category };
  if (search)
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ];
  if (brand) where.brand = { contains: brand };
  if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
  if (inStock === "true") where.stock = { gt: 0 };
  if (featured === "true") where.isFeatured = true;
  if (isNew === "true") where.isNew = true;

  const orderBy: any =
    sortBy === "price_asc"
      ? { price: "asc" }
      : sortBy === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [products, total, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ["brand"],
    }),
  ]);

  return { products, total, brands, pageNum, limit };
}

async function getCategoryInfo(slug?: string) {
  if (!slug) return null;
  return prisma.category.findUnique({ where: { slug } });
}

export default async function CatalogPage({ searchParams: searchParamsPromise }: CatalogPageProps) {
  const sp = await searchParamsPromise;

  const [{ products, total, brands, pageNum, limit }, currentCategory] =
    await Promise.all([
      getProducts(sp),
      getCategoryInfo(sp.category),
    ]);

  const totalPages = Math.ceil(total / limit);
  const brandList = brands
    .map((b) => b.brand)
    .filter((b): b is string => !!b)
    .sort();

  const title = currentCategory
    ? currentCategory.name
    : sp.search
    ? `Поиск: "${sp.search}"`
    : "Все товары";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Найдено {total} товаров</p>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <CatalogFilters brands={brandList} currentFilters={sp} />
        </div>

        <div className="flex-1 min-w-0">
          <SortBar total={total} current={sp.sortBy} />

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Товары не найдены</h3>
              <p className="text-gray-500 text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination current={pageNum} total={totalPages} searchParams={sp} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SortBar({ total, current }: { total: number; current?: string }) {
  const sorts = [
    { value: "newest", label: "Новинки" },
    { value: "price_asc", label: "Цена ↑" },
    { value: "price_desc", label: "Цена ↓" },
  ];

  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
      <span className="text-sm text-gray-500">{total} товаров</span>
      <div className="flex items-center gap-1">
        {sorts.map((s) => (
          <a
            key={s.value}
            href={"?" + new URLSearchParams({ sortBy: s.value }).toString()}
            className={
              "px-3 py-1.5 text-xs rounded-lg transition-colors " +
              ((current || "newest") === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number;
  total: number;
  searchParams: Record<string, string | undefined>;
}) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(searchParams).filter(([, v]) => v !== undefined)
      ) as Record<string, string>
    );
    params.set("page", String(page));
    return "?" + params.toString();
  };

  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => {
    if (total <= 5) return i + 1;
    if (current <= 3) return i + 1;
    if (current >= total - 2) return total - 4 + i;
    return current - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {current > 1 && (
        <a href={buildUrl(current - 1)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center">
          Назад
        </a>
      )}
      {pages.map((p) => (
        <a
          key={p}
          href={buildUrl(p)}
          className={
            "h-9 w-9 rounded-lg text-sm flex items-center justify-center transition-colors " +
            (p === current ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50")
          }
        >
          {p}
        </a>
      ))}
      {current < total && (
        <a href={buildUrl(current + 1)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center">
          Вперёд
        </a>
      )}
    </div>
  );
}
