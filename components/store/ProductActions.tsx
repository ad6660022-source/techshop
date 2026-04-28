"use client";

import { useState } from "react";
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
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    toast.success("Добавлено в корзину", {
      description: product.name,
      action: { label: "Открыть корзину", onClick: () => window.location.href = "/cart" },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(inWishlist ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleCompare = () => {
    const success = toggleCompare(product.id);
    if (!success) toast.error("Нельзя сравнивать более 4 товаров");
    else toast.success(inCompare ? "Убрано из сравнения" : "Добавлено к сравнению");
  };

  return (
    <div className="space-y-3">
      {/* Main CTA */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={cn(
          "w-full h-12 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2.5 transition-all duration-150",
          product.stock === 0
            ? "bg-[#f3ede0] text-[#b8a07a] cursor-not-allowed border border-[#e4d9c4]"
            : added
            ? "text-white active:scale-[0.98]"
            : "text-white active:scale-[0.98]"
        )}
        style={
          product.stock > 0
            ? added
              ? { background: "#3a7248", boxShadow: "0 3px 12px rgba(58,114,72,0.30)" }
              : { background: "#8c6530", boxShadow: "0 3px 12px rgba(140,101,48,0.30)" }
            : {}
        }
      >
        {added ? (
          <><Check className="w-5 h-5" /> Добавлено в корзину!</>
        ) : (
          <><ShoppingCart className="w-5 h-5" />{product.stock > 0 ? "В корзину" : "Нет в наличии"}</>
        )}
      </button>

      {/* Secondary actions */}
      <div className="flex gap-2.5">
        <button
          onClick={handleWishlist}
          className={cn(
            "flex-1 h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all",
            inWishlist
              ? "border-[#943828] bg-[#fdf0ec] text-[#943828]"
              : "border-[#d8cbb4] text-[#4e3e20] hover:border-[#943828] hover:bg-[#fdf0ec] hover:text-[#943828]"
          )}
        >
          <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
          {inWishlist ? "В избранном" : "В избранное"}
        </button>

        <button
          onClick={handleCompare}
          className={cn(
            "flex-1 h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all",
            inCompare
              ? "border-[#8c6530] bg-[#f0e6d0] text-[#8c6530]"
              : "border-[#d8cbb4] text-[#4e3e20] hover:border-[#8c6530] hover:bg-[#f0e6d0] hover:text-[#8c6530]"
          )}
        >
          <BarChart2 className="w-4 h-4" />
          {inCompare ? "Сравниваем" : "Сравнить"}
        </button>
      </div>

      {/* Info block */}
      <div className="bg-[#f4f0e6] rounded-xl border border-[#e8e0cc] p-4 space-y-2.5">
        {[
          "Доставка курьером по всей России",
          "Гарантия от производителя",
          "Возврат в течение 14 дней",
        ].map((text) => (
          <p key={text} className="flex items-center gap-2 text-[13px] text-[#4e3e20]">
            <span className="w-4 h-4 rounded-full bg-[#3a7248]/15 flex items-center justify-center flex-shrink-0">
              <span className="text-[#3a7248] text-[10px] font-bold">✓</span>
            </span>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
