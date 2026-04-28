"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
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
        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Корзина пуста</h2>
        <p className="text-[#7c7c99] mb-8">
          Добавьте товары из каталога, чтобы оформить заказ
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 h-12 px-6 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40"
        >
          <ShoppingBag className="w-5 h-5" />
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            Корзина{" "}
            <span className="text-[#7c7c99] text-lg font-normal">({items.length} позиций)</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-[#7c7c99] hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Очистить
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-[#111119] rounded-xl border border-white/8 p-4 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 bg-[#1c1c28] rounded-xl overflow-hidden flex-shrink-0">
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
                    className="text-sm font-medium text-[#f0f0fa] hover:text-violet-400 line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-base font-bold text-white mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-[#7c7c99] hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-[#7c7c99] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-1 text-[#3d3d52] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-[#111119] rounded-xl border border-white/8 p-5 sticky top-24">
              <h3 className="text-base font-semibold text-white mb-4">Итого</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#7c7c99]">
                    Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)
                  </span>
                  <span className="font-medium text-[#f0f0fa]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7c7c99]">Доставка</span>
                  <span className={deliveryCost === 0 ? "text-emerald-400 font-medium" : "font-medium text-[#f0f0fa]"}>
                    {deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}
                  </span>
                </div>
                {deliveryCost > 0 && (
                  <p className="text-xs text-[#3d3d52]">
                    Бесплатная доставка от {formatPrice(5000)}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/8">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Итого</span>
                  <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => setMessengerOpen(true)}
                className="mt-4 w-full h-12 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50"
              >
                <MessageCircle className="w-5 h-5" />
                Оформить заказ
              </button>

              <p className="text-xs text-[#3d3d52] text-center mt-3">
                Свяжитесь с менеджером в удобном мессенджере
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
