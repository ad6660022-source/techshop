"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, BarChart2, Star, Check } from "lucide-react";
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
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    toast.success("Добавлено в корзину", {
      description: product.name,
      action: { label: "Открыть", onClick: () => router.push("/cart") },
    });
    setTimeout(() => setAdded(false), 2000);
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
    <Link href={`/product/${product.slug}`} className={cn("group block", className)}>
      <div className="bg-white rounded-2xl border border-[#e8e0cc] overflow-hidden transition-all duration-200 group-hover:border-[#c0ae8c] group-hover:shadow-[0_6px_24px_rgba(80,56,20,0.11)] group-hover:-translate-y-1 h-full flex flex-col">

        {/* Image */}
        <div className="relative aspect-square bg-[#f4f0e6] overflow-hidden"
          onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <Image
            src={images[imgIdx]?.url || images[0].url}
            alt={images[imgIdx]?.alt || product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, i) => (
                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors", i === imgIdx ? "bg-[#c4882a]" : "bg-[#c0ae8c]/60")} />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {discount > 0 && <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#943828" }}>-{discount}%</span>}
            {product.isNew && <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#8c6530" }}>Новинка</span>}
            {product.stock === 0 && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#ede7d8", color: "#7e6840" }}>Нет в наличии</span>}
          </div>

          {/* Hover actions */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button onClick={handleWishlist}
              className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors border",
                inWishlist ? "text-white border-[#943828]" : "bg-white border-[#e8e0cc] text-[#7e6840] hover:border-[#943828]")}
              style={inWishlist ? { background: "#943828" } : {}}
              title="В избранное">
              <Heart className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} />
            </button>
            <button onClick={handleCompare}
              className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors border",
                inCompare ? "text-white border-[#8c6530]" : "bg-white border-[#e8e0cc] text-[#7e6840] hover:border-[#8c6530]")}
              style={inCompare ? { background: "#8c6530" } : {}}
              title="Сравнить">
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {product.brand && <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#b09870" }}>{product.brand}</p>}
          <h3 className="text-[13.5px] font-medium line-clamp-2 flex-1 mb-2.5 leading-snug" style={{ color: "#221c10" }}>{product.name}</h3>

          {(product.reviewCount ?? 0) > 0 ? (
            <div className="flex items-center gap-1.5 mb-2.5">
              <Star className="w-3.5 h-3.5 fill-[#c4882a]" style={{ color: "#c4882a" }} />
              <span className="text-[12.5px] font-semibold" style={{ color: "#221c10" }}>{(product.avgRating ?? 0).toFixed(1)}</span>
              <span className="text-[12px]" style={{ color: "#b09870" }}>({product.reviewCount} отз.)</span>
            </div>
          ) : (
            <div className="mb-2.5"><span className="text-[12px]" style={{ color: "#c8b898" }}>Нет отзывов</span></div>
          )}

          <div className="mb-3.5">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold" style={{ color: "#221c10" }}>{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="text-[13px] line-through" style={{ color: "#b09870" }}>{formatPrice(product.oldPrice)}</span>}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-[11.5px] font-semibold mt-0.5" style={{ color: "#943828" }}>Осталось {product.stock} шт.</p>
            )}
          </div>

          {/* Add to cart button */}
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className={cn("w-full h-9 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-150",
              product.stock === 0 ? "border border-[#e8e0cc] cursor-not-allowed" : "")}
            style={product.stock > 0
              ? added
                ? { background: "#3a7248", color: "#fff", boxShadow: "0 2px 8px rgba(58,114,72,0.25)" }
                : { background: "#8c6530", color: "#fff", boxShadow: "0 2px 8px rgba(140,101,48,0.25)" }
              : { background: "#f4f0e6", color: "#b09870" }}>
            {added ? <><Check className="w-4 h-4" /> Добавлено!</> : <><ShoppingCart className="w-4 h-4" />{product.stock > 0 ? "В корзину" : "Нет в наличии"}</>}
          </button>
        </div>
      </div>
    </Link>
  );
}
