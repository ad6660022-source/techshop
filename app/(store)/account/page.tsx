import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { User, Package, Heart, BarChart2 } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const userId = (session.user as any).id;

  const [orders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: { include: { images: { take: 1 } } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

      {/* User info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {session.user?.name || "Покупатель"}
            </h2>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-gray-500 mt-1">Заказов</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
          <p className="text-sm text-gray-500 mt-1">В избранном</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(orders.reduce((s, o) => s + o.total, 0))}
          </p>
          <p className="text-sm text-gray-500 mt-1">Сумма заказов</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/account/orders" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Мои заказы</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-gray-900">Избранное</span>
        </Link>
        <Link href="/compare" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-900">Сравнение</span>
        </Link>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Последние заказы</h3>
            <Link href="/account/orders" className="text-sm text-blue-600 hover:underline">
              Все заказы
            </Link>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">#{order.orderNumber}</span>
                    <span className="ml-2 text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{order.items.length} товаров</span>
                  <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
