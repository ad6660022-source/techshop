export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { id: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Редактирование товара</h1>
          <p className="text-gray-500 text-sm mt-1">{product.name}</p>
        </div>
      </div>

      <ProductForm
        initialData={{
          ...product,
          brand: product.brand ?? undefined,
          sku: product.sku ?? undefined,
          oldPrice: product.oldPrice ?? undefined,
          images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? undefined })),
        }}
        categories={categories}
      />
    </div>
  );
}
