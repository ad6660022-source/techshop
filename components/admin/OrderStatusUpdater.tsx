"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success(`Статус обновлён: ${ORDER_STATUS_LABELS[newStatus] || newStatus}`);
      router.refresh();
    } catch {
      toast.error("Ошибка при обновлении статуса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Изменить статус</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleUpdate(s)}
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
    </div>
  );
}
