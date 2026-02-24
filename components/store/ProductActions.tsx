"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, BarChart2, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const router = useRouter();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    toast.success("Добавлено в корзину!", {
      description: product.name,
      action: {
        label: "Перейти в корзину",
        onClick: () => router.push("/cart"),
      },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleCompare = () => {
    const success = toggleCompare(product.id);
    if (!success) {
      toast.error("Нельзя сравнивать более 4 товаров");
    } else {
      toast.success(inCompare ? "Убрано из сравнения" : "Добавлено к сравнению");
    }
  };

  return (
    <div className="space-y-3">
      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={cn(
          "w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2.5 transition-all duration-200",
          product.stock > 0
            ? added
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Добавлено!
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            {product.stock > 0 ? "Добавить в корзину" : "Нет в наличии"}
          </>
        )}
      </button>

      {/* Wishlist + Compare */}
      <div className="flex gap-3">
        <button
          onClick={handleWishlist}
          className={cn(
            "flex-1 h-10 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors",
            inWishlist
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          )}
        >
          <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
          {inWishlist ? "В избранном" : "В избранное"}
        </button>

        <button
          onClick={handleCompare}
          className={cn(
            "flex-1 h-10 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors",
            inCompare
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500"
          )}
        >
          <BarChart2 className="w-4 h-4" />
          {inCompare ? "Сравниваем" : "Сравнить"}
        </button>
      </div>

      {/* Delivery info */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
        <p className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          Доставка курьером по всей России
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          Гарантия от производителя
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          Возврат в течение 14 дней
        </p>
      </div>
    </div>
  );
}
