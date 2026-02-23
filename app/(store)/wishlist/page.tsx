"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { ProductCard } from "@/components/store/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";

export default function WishlistPage() {
  const { items, clearAll } = useWishlistStore();
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
      } catch {
        // ignore
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            Избранное
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} товаров</p>
        </div>
        {products.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Очистить всё
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Список избранного пуст</h2>
          <p className="text-gray-500 mb-8">
            Добавляйте товары в избранное, нажав на иконку сердца на карточке товара
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
