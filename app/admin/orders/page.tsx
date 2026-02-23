export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} заказов</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
            <p className="text-lg font-medium">Заказы отсутствуют</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                  <div>
                    <span className="text-gray-500">Клиент:</span>{" "}
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  {order.customerPhone && (
                    <div>
                      <span className="text-gray-500">Телефон:</span>{" "}
                      <span className="font-medium">{order.customerPhone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Email:</span>{" "}
                    <span className="font-medium">{order.customerEmail}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Адрес:</span>{" "}
                      <span className="font-medium">{order.deliveryAddress}</span>
                    </div>
                  )}
                  {order.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Комментарий:</span>{" "}
                      <span className="font-medium">{order.notes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
                    >
                      {item.product.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total + status updater */}
              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</p>
                  {order.discount > 0 && (
                    <p className="text-xs text-green-600">Скидка: −{formatPrice(order.discount)}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {order.paymentStatus === "PAID" ? "Оплачен" : "Ожидает оплаты"}
                  </p>
                </div>
                <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
