"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";

interface Messenger {
  id: string;
  type: string;
  name: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
}

const TYPES = [
  { value: "TELEGRAM", label: "Telegram" },
  { value: "VK", label: "ВКонтакте" },
  { value: "MAX", label: "Max" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Телефон" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  TELEGRAM: <Send className="w-4 h-4 text-[#29a9eb]" />,
  VK: <MessageCircle className="w-4 h-4 text-[#0077ff]" />,
  MAX: <MessageCircle className="w-4 h-4 text-[#ff6b00]" />,
  WHATSAPP: <MessageCircle className="w-4 h-4 text-[#25d366]" />,
  PHONE: <Phone className="w-4 h-4 text-violet-400" />,
};

const empty = { type: "TELEGRAM", name: "", link: "", isActive: true, sortOrder: 0 };

export default function AdminMessengersPage() {
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/messengers");
    if (res.ok) setMessengers(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.link.trim()) {
      toast.error("Заполните имя менеджера и ссылку");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/messengers/${editId}` : "/api/admin/messengers";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editId ? "Контакт обновлён" : "Контакт добавлен");
      setForm({ ...empty });
      setEditId(null);
      setShowForm(false);
      await load();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m: Messenger) => {
    setForm({ type: m.type, name: m.name, link: m.link, isActive: m.isActive, sortOrder: m.sortOrder });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить контакт?")) return;
    const res = await fetch(`/api/admin/messengers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Удалено");
      await load();
    } else {
      toast.error("Ошибка удаления");
    }
  };

  const handleToggle = async (m: Messenger) => {
    await fetch(`/api/admin/messengers/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...m, isActive: !m.isActive }),
    });
    await load();
  };

  const cancelEdit = () => {
    setForm({ ...empty });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Менеджеры и мессенджеры</h1>
          <p className="text-gray-400 text-sm mt-1">Контакты, которые видят покупатели при нажатии «Купить»</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 h-9 px-4 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1c1c28] border border-white/10 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            {editId ? "Редактировать контакт" : "Новый контакт"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Мессенджер</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Имя менеджера</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Александр"
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Ссылка / номер телефона
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://t.me/manager или +79001234567"
              className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Порядок</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-violet-500"
                />
                <span className="text-sm text-gray-300">Активен</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 h-9 px-4 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>
            <button type="button" onClick={cancelEdit} className="h-9 px-4 text-sm text-gray-400 hover:text-white transition-colors">
              Отмена
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#1c1c28] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : messengers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Нет добавленных контактов</p>
          <p className="text-sm mt-1">Нажмите «Добавить» чтобы создать первый</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messengers.map((m) => {
            const typeLabel = TYPES.find((t) => t.value === m.type)?.label || m.type;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-4 bg-[#1c1c28] border rounded-xl px-4 py-3 transition-all ${
                  m.isActive ? "border-white/10" : "border-white/5 opacity-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {TYPE_ICONS[m.type] || <MessageCircle className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-gray-500 truncate">{typeLabel} · {m.link}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(m)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      m.isActive
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-white/5 text-gray-500 hover:bg-white/10"
                    }`}
                    title={m.isActive ? "Деактивировать" : "Активировать"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEdit(m)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
