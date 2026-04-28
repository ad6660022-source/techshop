"use client";

import { useState } from "react";
import { MessageCircle, Heart, BarChart2 } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MessengerModal } from "./MessengerModal";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [messengerOpen, setMessengerOpen] = useState(false);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

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
    <>
      <div className="space-y-3">
        {/* Main CTA */}
        <button
          onClick={() => product.stock > 0 && setMessengerOpen(true)}
          disabled={product.stock === 0}
          className={cn(
            "w-full h-12 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2.5 transition-all duration-150",
            product.stock > 0
              ? "bg-[#6b4c2a] text-white hover:bg-[#573d22] active:scale-[0.98] shadow-[0_3px_12px_rgba(107,76,42,0.30)] hover:shadow-[0_5px_18px_rgba(107,76,42,0.40)]"
              : "bg-[#f3ede0] text-[#b8a07a] cursor-not-allowed border border-[#e4d9c4]"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          {product.stock > 0 ? "Купить через мессенджер" : "Нет в наличии"}
        </button>

        {/* Secondary actions */}
        <div className="flex gap-2.5">
          <button
            onClick={handleWishlist}
            className={cn(
              "flex-1 h-10 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all",
              inWishlist
                ? "border-[#9b3a2a] bg-[#fdf0ec] text-[#9b3a2a]"
                : "border-[#d4c4a4] text-[#5a3e1e] hover:border-[#9b3a2a] hover:bg-[#fdf0ec] hover:text-[#9b3a2a]"
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
                ? "border-[#6b4c2a] bg-[#f5ede0] text-[#6b4c2a]"
                : "border-[#d4c4a4] text-[#5a3e1e] hover:border-[#6b4c2a] hover:bg-[#f5ede0] hover:text-[#6b4c2a]"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            {inCompare ? "Сравниваем" : "Сравнить"}
          </button>
        </div>

        {/* Info block */}
        <div className="bg-[#f3ede0] rounded-xl border border-[#e4d9c4] p-4 space-y-2.5">
          {[
            "Доставка курьером по всей России",
            "Гарантия от производителя",
            "Возврат в течение 14 дней",
          ].map((text) => (
            <p key={text} className="flex items-center gap-2 text-[13px] text-[#5a3e1e]">
              <span className="w-4 h-4 rounded-full bg-[#3d7a4a]/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[#3d7a4a] text-[10px] font-bold">✓</span>
              </span>
              {text}
            </p>
          ))}
        </div>
      </div>

      <MessengerModal
        open={messengerOpen}
        onClose={() => setMessengerOpen(false)}
        productName={product.name}
      />
    </>
  );
}
