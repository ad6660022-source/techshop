"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, Image as ImageIcon, Video, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  isActive: boolean;
  sortOrder: number;
}

const empty = {
  title: "",
  subtitle: "",
  imageUrl: "",
  videoUrl: "",
  linkUrl: "",
  linkLabel: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    if (res.ok) setBanners(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl?.trim() && !form.videoUrl?.trim()) {
      toast.error("Укажите URL картинки или видео");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/banners/${editId}` : "/api/admin/banners";
      const method = editId ? "PUT" : "POST";
      const payload = {
        title: form.title || null,
        subtitle: form.subtitle || null,
        imageUrl: form.imageUrl || null,
        videoUrl: form.videoUrl || null,
        linkUrl: form.linkUrl || null,
        linkLabel: form.linkLabel || null,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editId ? "Баннер обновлён" : "Баннер добавлен");
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

  const handleEdit = (b: Banner) => {
    setForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      imageUrl: b.imageUrl || "",
      videoUrl: b.videoUrl || "",
      linkUrl: b.linkUrl || "",
      linkLabel: b.linkLabel || "",
      isActive: b.isActive,
      sortOrder: b.sortOrder,
    });
    setEditId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить баннер?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Удалено"); await load(); }
    else toast.error("Ошибка удаления");
  };

  const handleToggle = async (b: Banner) => {
    await fetch(`/api/admin/banners/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, isActive: !b.isActive }),
    });
    await load();
  };

  const cancel = () => { setForm({ ...empty }); setEditId(null); setShowForm(false); };

  const f = (field: keyof typeof empty, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Баннеры / Карусель</h1>
          <p className="text-gray-400 text-sm mt-1">
            Слайды главной страницы. Рекомендуемый размер картинки:{" "}
            <span className="text-gray-300 font-mono">1440 × 560 px</span> (JPG/PNG/WebP, до 3 МБ)
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 h-9 px-4 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        )}
      </div>

      {/* Hint */}
      <div className="bg-[#1c1c28] border border-amber-500/20 rounded-xl p-4 mb-5 text-sm text-gray-400">
        <p className="font-semibold text-amber-400 mb-1">Как добавить картинку или видео?</p>
        <ul className="space-y-1 text-[13px]">
          <li>• Загрузите файл на <strong className="text-gray-300">Cloudinary</strong> (через панель &rarr; Товары &rarr; редактирование) и вставьте URL</li>
          <li>• Или используйте любую прямую ссылку на изображение в интернете</li>
          <li>• Для видео: ссылка на MP4/WebM файл. Видео воспроизводится автоматически, без звука</li>
          <li>• Ссылка (куда ведёт клик) — необязательна, баннер может быть просто декоративным</li>
        </ul>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1c1c28] border border-white/10 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">{editId ? "Редактировать баннер" : "Новый баннер"}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Заголовок (необязательно)</label>
              <input type="text" value={form.title} onChange={e => f("title", e.target.value)} placeholder="Хиты сезона"
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Подзаголовок (необязательно)</label>
              <input type="text" value={form.subtitle} onChange={e => f("subtitle", e.target.value)} placeholder="Скидки до 30%"
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              URL картинки (1440×560 px)
            </label>
            <input type="url" value={form.imageUrl} onChange={e => f("imageUrl", e.target.value)}
              placeholder="https://res.cloudinary.com/... или другой прямой URL"
              className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              URL видео (MP4/WebM, необязательно, заменяет картинку)
            </label>
            <input type="url" value={form.videoUrl} onChange={e => f("videoUrl", e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                Ссылка (необязательно)
              </label>
              <input type="text" value={form.linkUrl} onChange={e => f("linkUrl", e.target.value)} placeholder="/catalog?featured=true"
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Текст кнопки</label>
              <input type="text" value={form.linkLabel} onChange={e => f("linkLabel", e.target.value)} placeholder="Смотреть акцию"
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Порядок показа</label>
              <input type="number" value={form.sortOrder} onChange={e => f("sortOrder", parseInt(e.target.value) || 0)}
                className="w-full h-9 bg-[#111119] border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => f("isActive", e.target.checked)} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-300">Активен</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 h-9 px-4 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-60 transition-colors">
              <Check className="w-4 h-4" />
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>
            <button type="button" onClick={cancel} className="h-9 px-4 text-sm text-gray-400 hover:text-white transition-colors">Отмена</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-20 bg-[#1c1c28] rounded-xl animate-pulse" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Нет баннеров</p>
          <p className="text-sm mt-1">Добавьте первый слайд карусели</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map(b => (
            <div key={b.id} className={`flex items-center gap-4 bg-[#1c1c28] border rounded-xl px-4 py-3 transition-all ${b.isActive ? "border-white/10" : "border-white/5 opacity-50"}`}>
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#111119] flex-shrink-0 border border-white/8">
                {b.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : b.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center"><Video className="w-5 h-5 text-gray-500" /></div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-600" /></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{b.title || <span className="text-gray-500 italic">Без заголовка</span>}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {b.subtitle || ""}
                  {b.linkUrl && <span className="ml-2 text-amber-600">→ {b.linkUrl}</span>}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleToggle(b)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${b.isActive ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                  title={b.isActive ? "Деактивировать" : "Активировать"}>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleEdit(b)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
