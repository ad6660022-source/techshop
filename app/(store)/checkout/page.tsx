"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronRight, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const promoId = searchParams.get("promoId") || "";
  const promoCode = searchParams.get("promoCode") || "";
  const promoDiscount = parseInt(searchParams.get("discount") || "0");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: (session?.user?.name as string) || "",
    customerEmail: (session?.user?.email as string) || "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryCost: "490",
    notes: "",
  });

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        customerName: (session.user?.name as string) || f.customerName,
        customerEmail: (session.user?.email as string) || f.customerEmail,
      }));
    }
  }, [session]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCost = subtotal > 5000 ? 0 : parseInt(form.deliveryCost) || 0;
  const total = subtotal + deliveryCost - promoDiscount;

  const updateForm = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          deliveryAddress: form.deliveryAddress,
          deliveryCost,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          promoCodeId: promoId || undefined,
          promoCode: promoCode || undefined,
          discount: promoDiscount,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Ошибка при оформлении заказа");
        return;
      }

      const order = await res.json();
      clearCart();
      router.push(`/order-success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
    } catch {
      toast.error("Ошибка при оформлении заказа");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Корзина пуста</h2>
        <Link href="/catalog" className="text-blue-600 hover:underline">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/cart" className="hover:text-blue-600">Корзина</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Оформление заказа</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Оформление заказа</h1>

          {/* Contact info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Контактные данные</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя и фамилия *
                </label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => updateForm("customerName", e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => updateForm("customerEmail", e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="ivan@example.ru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  required
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => updateForm("customerPhone", e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Доставка</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес доставки *
                </label>
                <input
                  required
                  value={form.deliveryAddress}
                  onChange={(e) => updateForm("deliveryAddress", e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="г. Москва, ул. Ленина, д. 1, кв. 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Способ доставки
                </label>
                <label className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
                  <input type="radio" name="delivery" checked readOnly />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Курьерская доставка</p>
                    <p className="text-xs text-gray-500">
                      {subtotal > 5000 ? "Бесплатно при заказе от 5 000 ₽" : "490 ₽ (бесплатно от 5 000 ₽)"}
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-gray-900">
                    {subtotal > 5000 ? "Бесплатно" : "490 ₽"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Оплата</h2>
            <label className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <input type="radio" name="payment" checked readOnly />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Банковская карта</p>
                <p className="text-xs text-gray-500">Visa, Mastercard, МИР, СБП</p>
              </div>
              <div className="flex gap-1">
                {["VISA", "MC", "МИР"].map((c) => (
                  <span key={c} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </label>
            <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-500" />
              Оплата защищена CloudPayments
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий к заказу
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Особые пожелания по доставке..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Оформляем...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Оформить заказ на {formatPrice(total)}
              </>
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Ваш заказ ({items.length})</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} шт.</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Товары</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Доставка</span>
                <span className={deliveryCost === 0 ? "text-green-600" : ""}>
                  {deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Промокод ({promoCode})</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-900">Итого</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
