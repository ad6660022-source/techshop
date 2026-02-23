import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/orders");

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-blue-600 hover:underline text-sm">← Кабинет</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Мои заказы</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex w-16 h-16 items-center justify-center bg-gray-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
          <p className="text-gray-500 mb-6 text-sm">Оформите первый заказ из нашего каталога</p>
          <Link href="/catalog" className="h-10 px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
            В каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div>
                  <span className="font-semibold text-gray-900">Заказ #{order.orderNumber}</span>
                  <span className="ml-3 text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="text-sm text-gray-700 flex-1 line-clamp-1">
                        {item.product.name}
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {item.quantity} шт. × {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-400">
                      + ещё {order.items.length - 3} позиций
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <span>Доставка: {order.deliveryCost > 0 ? formatPrice(order.deliveryCost) : "Бесплатно"}</span>
                  {order.promoCode && (
                    <span className="text-green-600">Промокод: {order.promoCode}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
