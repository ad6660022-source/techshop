"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MessengerModal } from "@/components/store/MessengerModal";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [messengerOpen, setMessengerOpen] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCost = subtotal > 5000 ? 0 : 490;
  const total = subtotal + deliveryCost;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-[#f3ede0] rounded-2xl border border-[#e4d9c4] flex items-center justify-center mx-auto mb-6 text-4xl">
          🛒
        </div>
        <h2 className="text-[22px] font-bold text-[#241a0c] mb-3">Корзина пуста</h2>
        <p className="text-[#8a6e48] mb-8 text-[14px]">
          Добавьте товары из каталога, чтобы оформить заказ
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 h-11 px-6 bg-[#6b4c2a] text-white font-semibold rounded-xl hover:bg-[#573d22] transition-all shadow-[0_3px_12px_rgba(107,76,42,0.30)] text-[14px]"
        >
          <ShoppingBag className="w-4 h-4" />
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-[22px] font-bold text-[#241a0c]">
            Корзина{" "}
            <span className="text-[#8a6e48] text-[16px] font-normal">({items.length} позиций)</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-[13px] text-[#8a6e48] hover:text-[#9b3a2a] flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Очистить корзину
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-[#e4d9c4] p-4 flex items-center gap-4 hover:border-[#c4a87a] transition-colors"
              >
                <div className="relative w-20 h-20 bg-[#f3ede0] rounded-xl overflow-hidden flex-shrink-0 border border-[#e4d9c4]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productId}`}
                    className="text-[13.5px] font-medium text-[#241a0c] hover:text-[#6b4c2a] line-clamp-2 transition-colors leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[15px] font-bold text-[#241a0c] mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg border border-[#d4c4a4] flex items-center justify-center text-[#5a3e1e] hover:bg-[#f3ede0] hover:border-[#b8a07a] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-[14px] font-bold text-[#241a0c]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-lg border border-[#d4c4a4] flex items-center justify-center text-[#5a3e1e] hover:bg-[#f3ede0] hover:border-[#b8a07a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right flex-shrink-0 min-w-[80px]">
                  <p className="font-bold text-[#241a0c] text-[15px]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-1.5 text-[#c4b090] hover:text-[#9b3a2a] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#e4d9c4] p-5 sticky top-24">
              <h3 className="text-[15px] font-bold text-[#241a0c] mb-4">Итого</h3>

              <div className="space-y-3 text-[13.5px]">
                <div className="flex justify-between">
                  <span className="text-[#8a6e48]">
                    Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)
                  </span>
                  <span className="font-semibold text-[#241a0c]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a6e48]">Доставка</span>
                  <span className={deliveryCost === 0 ? "text-[#3d7a4a] font-semibold" : "font-semibold text-[#241a0c]"}>
                    {deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}
                  </span>
                </div>
                {deliveryCost > 0 && (
                  <p className="text-[12px] text-[#b8a07a] bg-[#f3ede0] rounded-lg px-3 py-2">
                    До бесплатной доставки: {formatPrice(5000 - subtotal)}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#e4d9c4] flex justify-between items-baseline">
                <span className="font-bold text-[#241a0c]">К оплате</span>
                <span className="text-[20px] font-black text-[#241a0c]">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => setMessengerOpen(true)}
                className="mt-4 w-full h-12 bg-[#6b4c2a] text-white font-bold rounded-xl hover:bg-[#573d22] transition-all flex items-center justify-center gap-2 shadow-[0_3px_12px_rgba(107,76,42,0.30)] hover:shadow-[0_5px_18px_rgba(107,76,42,0.40)] text-[15px]"
              >
                <MessageCircle className="w-5 h-5" />
                Оформить заказ
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              <p className="text-[12px] text-[#b8a07a] text-center mt-3">
                Свяжитесь с менеджером удобным способом
              </p>
            </div>
          </div>
        </div>
      </div>

      <MessengerModal
        open={messengerOpen}
        onClose={() => setMessengerOpen(false)}
      />
    </>
  );
}
