export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Tag } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} категорий</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Список категорий</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <Tag className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                </div>
                <span className="text-sm text-gray-500 shrink-0">
                  {cat._count.products} товаров
                </span>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-8 text-center text-gray-400">Категорий нет</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Добавить категорию</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <CategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
