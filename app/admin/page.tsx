import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, Users, TrendingUp, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    revenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  return { totalOrders, pendingOrders, totalProducts, totalUsers, recentOrders, revenue };
}

export default async function AdminDashboard() {
  const { totalOrders, pendingOrders, totalProducts, totalUsers, recentOrders, revenue } =
    await getStats();

  const STATS = [
    {
      title: "Выручка",
      value: formatPrice(revenue._sum.total || 0),
      subtitle: "Оплаченные заказы",
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Заказов",
      value: totalOrders,
      subtitle: `${pendingOrders} ожидают`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Товаров",
      value: totalProducts,
      subtitle: "Активных",
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Покупателей",
      value: totalUsers,
      subtitle: "Зарегистрированных",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const ORDER_STATUS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Ожидает", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Подтверждён", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "В обработке", color: "bg-purple-100 text-purple-700" },
    SHIPPED: { label: "Отправлен", color: "bg-indigo-100 text-indigo-700" },
    DELIVERED: { label: "Доставлен", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Отменён", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-sm text-gray-500 mt-1">Добро пожаловать в панель управления</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить товар
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-900 font-medium">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            Все заказы
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Заказов пока нет</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => {
              const statusInfo = ORDER_STATUS[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {order.customerName} · {order.items.length} позиций
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
