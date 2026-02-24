"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Props {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
}

const CANCELLABLE = ["PENDING", "CONFIRMED", "PROCESSING"];

export function CancelOrderButton({ orderId, orderNumber, status, paymentStatus }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!CANCELLABLE.includes(status)) return null;

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Ошибка при отмене");
        return;
      }
      if (data.needsRefund) {
        toast.success(`Заказ #${orderNumber} отменён. Средства вернутся в течение 3–5 рабочих дней.`, {
          duration: 6000,
        });
      } else {
        toast.success(`Заказ #${orderNumber} отменён`);
      }
      router.refresh();
    } catch {
      toast.error("Ошибка при отмене заказа");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">
          {paymentStatus === "PAID"
            ? "Оплата возвращается за 3–5 рабочих дней. Подтвердить?"
            : "Вы уверены, что хотите отменить заказ?"}
        </span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="h-7 px-3 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Отменяем..." : "Да, отменить"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="h-7 px-3 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Нет
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      <X className="w-3 h-3" />
      Отменить заказ
    </button>
  );
}
