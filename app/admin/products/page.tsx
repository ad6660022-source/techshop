export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { take: 1 },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} товаров</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить товар
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">
                Фото
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Название
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                Категория
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Цена
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Остаток
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                Статус
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-600">{product.category?.name}</span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</p>
                  {product.oldPrice && (
                    <p className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</p>
                  )}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span
                    className={`text-sm font-medium ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock < 5
                        ? "text-orange-500"
                        : "text-gray-700"
                    }`}
                  >
                    {product.stock} шт.
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.isActive ? "Активен" : "Скрыт"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Товары не найдены</p>
            <p className="text-sm mt-1">Добавьте первый товар</p>
          </div>
        )}
      </div>
    </div>
  );
}
