"use client";

import { useEffect, useState } from "react";
import { useCompareStore } from "@/lib/store/compare";
import { ArrowLeftRight, X, Check, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          items.map((id) =>
            fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))
          )
        );
        setProducts(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [items]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-8 bg-gray-100 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
            <ArrowLeftRight className="w-10 h-10 text-blue-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет товаров для сравнения</h2>
          <p className="text-gray-500 mb-8">
            Добавьте до 4 товаров для сравнения характеристик
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  // Collect all unique spec groups/names across all products
  const allSpecs: { group: string; name: string }[] = [];
  products.forEach((p) => {
    p.specs?.forEach((spec) => {
      if (!allSpecs.find((s) => s.group === spec.group && s.name === spec.name)) {
        allSpecs.push({ group: spec.group || "", name: spec.name });
      }
    });
  });

  // Group specs
  const specGroups: Record<string, string[]> = {};
  allSpecs.forEach(({ group, name }) => {
    if (!specGroups[group]) specGroups[group] = [];
    if (!specGroups[group].includes(name)) specGroups[group].push(name);
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success("Товар добавлен в корзину");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            Сравнение товаров
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} из 4 товаров</p>
        </div>
        <button
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Очистить всё
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Product headers */}
          <thead>
            <tr>
              <th className="w-48 text-left text-sm font-medium text-gray-500 pb-4 pr-4">
                Характеристика
              </th>
              {products.map((product) => (
                <th key={product.id} className="pb-4 px-3 text-center align-top">
                  <div className="relative">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/product/${product.slug}`}>
                      <div className="w-32 h-32 mx-auto mb-3 relative rounded-xl overflow-hidden bg-gray-50">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </p>
                    </Link>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatPrice(product.price)}
                    </p>
                    {product.oldPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </p>
                    )}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="mt-3 w-full h-9 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      В корзину
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Basic info */}
            <tr className="bg-gray-50">
              <td colSpan={products.length + 1} className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide rounded-lg">
                Основное
              </td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 pr-4 text-sm text-gray-600">Бренд</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 px-3 text-sm text-center font-medium">
                  {p.brand || "—"}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 pr-4 text-sm text-gray-600">Наличие</td>
              {products.map((p) => (
                <td key={p.id} className="py-3 px-3 text-sm text-center">
                  {p.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <Check className="w-4 h-4" /> В наличии
                    </span>
                  ) : (
                    <span className="text-red-500">Нет в наличии</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Specs by group */}
            {Object.entries(specGroups).map(([group, names]) => (
              <>
                {group && (
                  <tr key={`group-${group}`} className="bg-gray-50">
                    <td colSpan={products.length + 1} className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide rounded-lg">
                      {group}
                    </td>
                  </tr>
                )}
                {names.map((name) => {
                  const values = products.map((p) => {
                    const spec = p.specs?.find((s) => s.name === name && (s.group || "") === group);
                    return spec?.value || null;
                  });
                  const allSame = values.every((v) => v === values[0]);
                  return (
                    <tr key={`${group}-${name}`} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-sm text-gray-600">{name}</td>
                      {values.map((val, i) => (
                        <td
                          key={i}
                          className={`py-3 px-3 text-sm text-center ${
                            !allSame && val
                              ? "font-semibold text-blue-700 bg-blue-50"
                              : ""
                          }`}
                        >
                          {val || <Minus className="w-4 h-4 text-gray-300 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
