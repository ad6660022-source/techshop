"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Image as ImageIcon, GripVertical, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    oldPrice?: number | null;
    stock?: number;
    brand?: string;
    sku?: string;
    categoryId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    images?: { url: string; alt?: string }[];
    specs?: { group: string; name: string; value: string }[];
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    oldPrice: initialData?.oldPrice?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    brand: initialData?.brand || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isNew: initialData?.isNew ?? false,
  });

  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    initialData?.images?.map((i) => ({ url: i.url, alt: i.alt || "" })) || []
  );

  const [specs, setSpecs] = useState<{ group: string; name: string; value: string }[]>(
    initialData?.specs || []
  );

  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, { url: newImageUrl.trim(), alt: form.name }]);
    setNewImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || "Ошибка загрузки");
        return;
      }
      const { urls } = await res.json();
      setImages((prev) => [...prev, ...urls.map((url: string) => ({ url, alt: form.name }))]);
      toast.success(`Загружено ${urls.length} фото`);
    } catch {
      toast.error("Ошибка загрузки файлов");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const addSpec = () => {
    setSpecs([...specs, { group: "Основные", name: "", value: "" }]);
  };

  const updateSpec = (idx: number, field: string, value: string) => {
    setSpecs(specs.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const removeSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const slugify = (text: string) => {
    const map: Record<string, string> = {
      а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",к:"k",л:"l",м:"m",
      н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",
      ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
    };
    return text.toLowerCase().split("").map(c => map[c] ?? c).join("")
      .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { toast.error("Выберите категорию"); return; }
    if (!form.price) { toast.error("Укажите цену"); return; }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
        stock: parseInt(form.stock) || 0,
        brand: form.brand || null,
        sku: form.sku || null,
        categoryId: form.categoryId,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        images,
        specs: specs.filter((s) => s.name && s.value),
      };

      const url = isEdit ? `/api/products/${initialData!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Ошибка при сохранении");
        return;
      }

      toast.success(isEdit ? "Товар обновлён!" : "Товар добавлен!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Основная информация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Apple iPhone 15 Pro 256GB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Подробное описание товара..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Бренд</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Apple, Samsung..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Артикул (SKU)</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="APPLE-IP15P-256" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Цена и остаток</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена * (₽)</label>
                <input required type="number" min="0" step="0.01" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="99990" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Старая цена (₽)</label>
                <input type="number" min="0" step="0.01" value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="114990" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Остаток (шт.)</label>
                <input type="number" min="0" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="10" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              Фотографии
            </h3>
            {/* File upload */}
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  Загружаем...
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <span className="font-medium text-blue-600">Нажмите для загрузки</span> или перетащите файлы
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Несколько файлов</p>
                </div>
              )}
            </div>

            {/* URL input */}
            <div className="flex gap-2 mb-4">
              <input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Или вставьте URL изображения (https://...)" />
              <button type="button" onClick={addImage}
                className="h-9 px-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Первое фото — главное на карточке товара.</p>
            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <img src={img.url} alt="" className="w-10 h-10 object-contain bg-white rounded border border-gray-100 flex-shrink-0" />
                    <span className="flex-1 text-xs text-gray-500 truncate">{img.url}</span>
                    <button type="button" onClick={() => removeImage(idx)} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Характеристики</h3>
              <button type="button" onClick={addSpec}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
            {specs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Нет характеристик. Нажмите "+ Добавить"</p>
            ) : (
              <div className="space-y-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                    <input value={spec.group} onChange={(e) => updateSpec(idx, "group", e.target.value)}
                      className="h-8 border border-gray-200 rounded-lg px-2 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Группа" />
                    <input value={spec.name} onChange={(e) => updateSpec(idx, "name", e.target.value)}
                      className="h-8 border border-gray-200 rounded-lg px-2 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Название" />
                    <div className="flex gap-1">
                      <input value={spec.value} onChange={(e) => updateSpec(idx, "value", e.target.value)}
                        className="flex-1 h-8 border border-gray-200 rounded-lg px-2 text-xs focus:outline-none focus:border-blue-500"
                        placeholder="Значение" />
                      <button type="button" onClick={() => removeSpec(idx)} className="text-gray-400 hover:text-red-500 px-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Публикация</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Активен</span>
                <div onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${form.isActive ? "bg-blue-600" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Рекомендуемый</span>
                <div onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${form.isFeatured ? "bg-blue-600" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Новинка</span>
                <div onClick={() => setForm({ ...form, isNew: !form.isNew })}
                  className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${form.isNew ? "bg-blue-600" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isNew ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Категория *</h3>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500">
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? "Сохраняем..." : isEdit ? "Обновить товар" : "Добавить товар"}
          </button>
        </div>
      </div>
    </form>
  );
}
