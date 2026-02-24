"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/utils";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus, currentPaymentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const patch = async (body: Record<string, string>) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      await patch({ status: newStatus });
      setStatus(newStatus);
      toast.success("Статус обновлён: " + (ORDER_STATUS_LABELS[newStatus] || newStatus));
      router.refresh();
    } catch {
      toast.error("Ошибка при обновлении статуса");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    if (newPaymentStatus === paymentStatus) return;
    setLoading(true);
    try {
      await patch({ paymentStatus: newPaymentStatus });
      setPaymentStatus(newPaymentStatus);
      toast.success("Статус оплаты: " + (PAYMENT_STATUS_LABELS[newPaymentStatus] || newPaymentStatus));
      router.refresh();
    } catch {
      toast.error("Ошибка при обновлении статуса оплаты");
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = status === "CANCELLED";
  const needsRefund = isCancelled && paymentStatus === "PAID";
  const isRefunded = isCancelled && paymentStatus === "REFUNDED";

  return (
    <div className="space-y-3">
      {/* Order Status */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Статус заказа</p>
        {isCancelled ? (
          <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 inline-block">
            Заказ отменён — статус изменить нельзя
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  s === status
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ORDER_STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Статус оплаты</p>
        {isRefunded ? (
          <span className="text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 inline-block">
            &#10003; Возврат выполнен
          </span>
        ) : needsRefund ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 inline-block">
              &#9888; Требует возврата средств
            </p>
            <br />
            <button
              onClick={() => handlePaymentStatusUpdate("REFUNDED")}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              Отметить возврат выполненным
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {PAYMENT_STATUSES.map((ps) => (
              <button
                key={ps}
                onClick={() => handlePaymentStatusUpdate(ps)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  ps === paymentStatus
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {PAYMENT_STATUS_LABELS[ps] || ps}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
