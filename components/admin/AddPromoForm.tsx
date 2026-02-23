"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddPromoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : 0,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
          code: form.code.toUpperCase().trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Ошибка при создании промокода");
        return;
      }
      toast.success("Промокод создан!");
      setForm({ code: "", description: "", type: "PERCENTAGE", value: "", minOrder: "", maxUses: "", expiresAt: "" });
      router.refresh();
    } catch {
      toast.error("Ошибка при создании промокода");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Код *</label>
        <input
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm font-mono focus:outline-none focus:border-blue-500"
          placeholder="SUMMER20"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Описание</label>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Летняя акция"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Тип</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="PERCENTAGE">Процент (%)</option>
            <option value="FIXED">Сумма (₽)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {form.type === "PERCENTAGE" ? "Скидка %" : "Скидка ₽"} *
          </label>
          <input
            required
            type="number"
            min="1"
            max={form.type === "PERCENTAGE" ? "100" : undefined}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
            placeholder={form.type === "PERCENTAGE" ? "10" : "500"}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Мин. сумма заказа (₽)</label>
        <input
          type="number"
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
          className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          placeholder="0"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Макс. использований</label>
          <input
            type="number"
            value={form.maxUses}
            onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Без лимита"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Дата истечения</label>
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {loading ? "Создаём..." : "Создать промокод"}
      </button>
    </form>
  );
}
