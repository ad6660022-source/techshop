export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import { AcceptReturnButton } from "@/components/admin/AcceptReturnButton";
import { PackageX, PackageCheck } from "lucide-react";

export default async function ReturnsPage() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ["RETURNING", "RETURNED"] } },
    include: {
      items: {
        include: { product: { select: { name: true, stock: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const returning = orders.filter((o) => o.status === "RETURNING");
  const returned = orders.filter((o) => o.status === "RETURNED");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Возвраты</h1>
        <p className="text-gray-500 text-sm mt-1">
          Управление возвратами товаров от покупателей
        </p>
      </div>

      {/* Returning — in transit */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <PackageX className="w-5 h-5 text-orange-500" />
          <h2 className="text-base font-semibold text-gray-800">Едут обратно</h2>
          {returning.length > 0 && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {returning.length}
            </span>
          )}
        </div>

        {returning.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            <p className="text-sm">Нет активных возвратов в пути</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returning.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-orange-200 bg-orange-50/20 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                        Едет обратно
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(order.updatedAt)}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-gray-400">Клиент:</span>{" "}
                      <span className="font-medium">{order.customerName}</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="px-2 py-1 bg-orange-100 rounded-lg text-xs text-orange-800"
                        >
                          {item.product.name} × {item.quantity}
                          <span className="text-orange-500 ml-1">(остаток: {item.product.stock})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                    <AcceptReturnButton orderId={order.id} orderNumber={order.orderNumber} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Returned — completed */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PackageCheck className="w-5 h-5 text-teal-500" />
          <h2 className="text-base font-semibold text-gray-800">Принятые возвраты</h2>
          {returned.length > 0 && (
            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
              {returned.length}
            </span>
          )}
        </div>

        {returned.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            <p className="text-sm">Принятых возвратов нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {returned.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                        ✓ Возвращён
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(order.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.customerName} — {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                    </p>
                  </div>
                  <p className="text-base font-bold text-gray-700">{formatPrice(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
