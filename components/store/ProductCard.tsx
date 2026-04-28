"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, MessageCircle, BarChart2, Star } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MessengerModal } from "./MessengerModal";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [messengerOpen, setMessengerOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = product.oldPrice ? calculateDiscount(product.price, product.oldPrice) : 0;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", alt: product.name }];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.floor((x / rect.width) * images.length);
    setImgIdx(Math.min(Math.max(idx, 0), images.length - 1));
  };

  const handleMouseLeave = () => setImgIdx(0);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    setMessengerOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const success = toggleCompare(product.id);
    if (!success) toast.error("Нельзя сравнивать более 4 товаров");
    else toast.success(inCompare ? "Убрано из сравнения" : "Добавлено к сравнению");
  };

  return (
    <>
      <Link href={`/product/${product.slug}`} className={cn("group block", className)}>
        <div className="bg-[#111119] rounded-2xl border border-white/8 overflow-hidden transition-all duration-200 group-hover:border-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-900/20 group-hover:-translate-y-1 h-full flex flex-col">
          <div
            className="relative aspect-square bg-[#1c1c28] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[imgIdx]?.url || images[0].url}
              alt={images[imgIdx]?.alt || product.name}
              fill
              className="object-contain p-4 transition-all duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {images.map((_, i) => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === imgIdx ? "bg-violet-400" : "bg-white/30")} />
                ))}
              </div>
            )}

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-md">-{discount}%</span>
              )}
              {product.isNew && (
                <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">Новинка</span>
              )}
              {product.stock === 0 && (
                <span className="bg-white/10 text-[#7c7c99] text-xs font-bold px-2 py-0.5 rounded-md">Нет в наличии</span>
              )}
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button onClick={handleWishlist}
                className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors",
                  inWishlist ? "bg-red-500 text-white" : "bg-[#111119] text-[#7c7c99] hover:bg-red-500/20 hover:text-red-400")}
                title="В избранное">
                <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
              </button>
              <button onClick={handleCompare}
                className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors",
                  inCompare ? "bg-violet-500 text-white" : "bg-[#111119] text-[#7c7c99] hover:bg-violet-500/20 hover:text-violet-400")}
                title="Сравнить">
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 flex flex-col flex-1">
            {product.brand && (
              <p className="text-xs text-[#7c7c99] mb-1 font-medium uppercase tracking-wide">{product.brand}</p>
            )}
            <h3 className="text-sm font-medium text-[#f0f0fa] line-clamp-2 flex-1 mb-2">{product.name}</h3>

            {(product.reviewCount ?? 0) > 0 ? (
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-[#f0f0fa]">
                  {(product.avgRating ?? 0).toFixed(1)}
                </span>
                <span className="text-xs text-[#7c7c99]">({product.reviewCount} отз.)</span>
              </div>
            ) : (
              <div className="mb-2">
                <span className="text-xs text-[#3d3d52]">Нет отзывов</span>
              </div>
            )}

            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-sm text-[#3d3d52] line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-xs text-amber-500 font-medium mt-0.5">Осталось {product.stock} шт.</p>
              )}
            </div>

            <button
              onClick={handleBuy}
              disabled={product.stock === 0}
              className={cn(
                "w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150",
                product.stock > 0
                  ? "bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.98]"
                  : "bg-white/5 text-[#3d3d52] cursor-not-allowed"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              {product.stock > 0 ? "Купить" : "Нет в наличии"}
            </button>
          </div>
        </div>
      </Link>

      <MessengerModal
        open={messengerOpen}
        onClose={() => setMessengerOpen(false)}
        productName={product.name}
      />
    </>
  );
}
