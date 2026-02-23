"use client";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoData, setPromoData] = useState<{
    code: string;
    discount: number;
    description?: string;
    promoId: string;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCost = subtotal > 5000 ? 0 : 490;
  const discount = promoData?.discount || 0;
  const total = subtotal + deliveryCost - discount;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), orderTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Промокод не найден");
        return;
      }
      setPromoData(data);
      toast.success(`Промокод применён! Скидка ${formatPrice(data.discount)}`);
    } catch {
      toast.error("Ошибка при проверке промокода");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoData(null);
    setPromoCode("");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Корзина пуста</h2>
        <p className="text-gray-500 mb-8">
          Добавьте товары из каталога, чтобы оформить заказ
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Корзина <span className="text-gray-400 text-lg font-normal">({items.length} позиций)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Очистить
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
            >
              {/* Image */}
              <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.productId}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-base font-bold text-gray-900 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total + remove */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="mt-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo code */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Промокод
            </h3>
            {promoData ? (
              <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-green-700">{promoData.code}</p>
                  <p className="text-xs text-green-600">
                    Скидка {formatPrice(promoData.discount)}
                  </p>
                </div>
                <button onClick={removePromo} className="text-green-600 hover:text-red-500 text-sm">
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Введите промокод"
                  className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="h-9 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {promoLoading ? "..." : "OK"}
                </button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Итого</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Доставка</span>
                <span className={deliveryCost === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Промокод</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              {deliveryCost > 0 && (
                <p className="text-xs text-gray-500">
                  Бесплатная доставка от {formatPrice(5000)}
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Итого</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              href={`/checkout${promoData ? `?promoId=${promoData.promoId}&promoCode=${promoData.code}&discount=${promoData.discount}` : ""}`}
              className="mt-4 w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              Оформить заказ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
