"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeletePromoButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Удалить промокод?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/promo/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Промокод удалён");
        router.refresh();
      } else {
        toast.error("Ошибка при удалении");
      }
    } catch {
      toast.error("Ошибка при удалении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
      title="Удалить промокод"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
