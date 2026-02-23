"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, BarChart2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = product.oldPrice ? calculateDiscount(product.price, product.oldPrice) : 0;

  const image =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product);
    toast.success("Добавлено в корзину", {
      description: product.name,
      action: {
        label: "Открыть",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const success = toggleCompare(product.id);
    if (!success) {
      toast.error("Нельзя сравнивать более 4 товаров");
    } else {
      toast.success(inCompare ? "Убрано из сравнения" : "Добавлено к сравнению");
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className={cn("group block", className)}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                Новинка
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                Нет в наличии
              </span>
            )}
          </div>
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleWishlist}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors",
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
              )}
              title="В избранное"
            >
              <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleCompare}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors",
                inCompare
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500"
              )}
              title="Сравнить"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mb-3">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-orange-600 font-medium mt-0.5">
                Осталось {product.stock} шт.
              </p>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "w-full h-9 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150",
              product.stock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock > 0 ? "В корзину" : "Нет в наличии"}
          </button>
        </div>
      </div>
    </Link>
  );
}
