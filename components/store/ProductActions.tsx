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
    if (!success) {
      toast.error("Нельзя сравнивать более 4 товаров");
    } else {
      toast.success(inCompare ? "Убрано из сравнения" : "Добавлено к сравнению");
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Buy via messenger */}
        <button
          onClick={() => product.stock > 0 && setMessengerOpen(true)}
          disabled={product.stock === 0}
          className={cn(
            "w-full h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2.5 transition-all duration-200",
            product.stock > 0
              ? "bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.98] shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50"
              : "bg-white/5 text-[#3d3d52] cursor-not-allowed"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          {product.stock > 0 ? "Купить через мессенджер" : "Нет в наличии"}
        </button>

        {/* Wishlist + Compare */}
        <div className="flex gap-3">
          <button
            onClick={handleWishlist}
            className={cn(
              "flex-1 h-10 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              inWishlist
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-white/8 text-[#7c7c99] hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
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
                ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                : "border-white/8 text-[#7c7c99] hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            {inCompare ? "Сравниваем" : "Сравнить"}
          </button>
        </div>

        {/* Delivery info */}
        <div className="bg-[#1c1c28] rounded-xl p-4 text-sm text-[#7c7c99] space-y-2 border border-white/5">
          <p className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Доставка курьером по всей России
          </p>
          <p className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Гарантия от производителя
          </p>
          <p className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Возврат в течение 14 дней
          </p>
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
