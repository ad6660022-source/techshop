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
        <div className="bg-white rounded-2xl border border-[#e4d9c4] overflow-hidden transition-all duration-200 group-hover:border-[#c4a87a] group-hover:shadow-[0_6px_24px_rgba(100,72,32,0.12)] group-hover:-translate-y-1 h-full flex flex-col">

          {/* Image area */}
          <div
            className="relative aspect-square bg-[#f3ede0] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[imgIdx]?.url || images[0].url}
              alt={images[imgIdx]?.alt || product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Image dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {images.map((_, i) => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === imgIdx ? "bg-[#b8721e]" : "bg-[#c4a87a]/60")} />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              {discount > 0 && (
                <span className="bg-[#9b3a2a] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">-{discount}%</span>
              )}
              {product.isNew && (
                <span className="bg-[#6b4c2a] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">Новинка</span>
              )}
              {product.stock === 0 && (
                <span className="bg-[#ede5d2] text-[#8a6e48] text-[11px] font-bold px-2 py-0.5 rounded-md">Нет в наличии</span>
              )}
            </div>

            {/* Hover actions */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button onClick={handleWishlist}
                className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors border",
                  inWishlist
                    ? "bg-[#9b3a2a] border-[#9b3a2a] text-white"
                    : "bg-white border-[#e4d9c4] text-[#8a6e48] hover:bg-[#fdf0ec] hover:border-[#9b3a2a] hover:text-[#9b3a2a]")}
                title="В избранное">
                <Heart className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} />
              </button>
              <button onClick={handleCompare}
                className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors border",
                  inCompare
                    ? "bg-[#6b4c2a] border-[#6b4c2a] text-white"
                    : "bg-white border-[#e4d9c4] text-[#8a6e48] hover:bg-[#f5ede0] hover:border-[#6b4c2a] hover:text-[#6b4c2a]")}
                title="Сравнить">
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {product.brand && (
              <p className="text-[11px] text-[#b8a07a] mb-1 font-semibold uppercase tracking-widest">{product.brand}</p>
            )}
            <h3 className="text-[13.5px] font-medium text-[#241a0c] line-clamp-2 flex-1 mb-2.5 leading-snug">{product.name}</h3>

            {/* Rating */}
            {(product.reviewCount ?? 0) > 0 ? (
              <div className="flex items-center gap-1.5 mb-2.5">
                <Star className="w-3.5 h-3.5 text-[#b8721e] fill-[#b8721e]" />
                <span className="text-[12.5px] font-semibold text-[#241a0c]">
                  {(product.avgRating ?? 0).toFixed(1)}
                </span>
                <span className="text-[12px] text-[#b8a07a]">({product.reviewCount} отз.)</span>
              </div>
            ) : (
              <div className="mb-2.5">
                <span className="text-[12px] text-[#c4b090]">Нет отзывов</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-3.5">
              <div className="flex items-baseline gap-2">
                <span className="text-[17px] font-bold text-[#241a0c]">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-[13px] text-[#b8a07a] line-through">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-[11.5px] text-[#9b3a2a] font-semibold mt-0.5">Осталось {product.stock} шт.</p>
              )}
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={product.stock === 0}
              className={cn(
                "w-full h-9 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-150",
                product.stock > 0
                  ? "bg-[#6b4c2a] text-white hover:bg-[#573d22] active:scale-[0.98] shadow-[0_2px_8px_rgba(107,76,42,0.25)] hover:shadow-[0_4px_12px_rgba(107,76,42,0.35)]"
                  : "bg-[#f3ede0] text-[#b8a07a] cursor-not-allowed border border-[#e4d9c4]"
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
