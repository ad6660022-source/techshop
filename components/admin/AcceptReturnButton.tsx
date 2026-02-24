"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  orderId: string;
  orderNumber: string;
}

export function AcceptReturnButton({ orderId, orderNumber }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RETURNED" }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Возврат по заказу #${orderNumber} принят — остаток восстановлен`);
      router.refresh();
    } catch {
      toast.error("Ошибка при обновлении статуса");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Товар прибыл? Остаток будет восстановлен.</span>
        <button
          onClick={handleAccept}
          disabled={loading}
          className="h-7 px-3 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Сохраняем..." : "Да, принять"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="h-7 px-3 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="h-8 px-4 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors"
    >
      Принять возврат
    </button>
  );
}
