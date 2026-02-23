export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Новый товар</h1>
        <p className="text-sm text-gray-500 mt-1">Заполните информацию о товаре</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
