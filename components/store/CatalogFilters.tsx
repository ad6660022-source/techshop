"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface CatalogFiltersProps {
  brands: string[];
  currentFilters: {
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sortBy?: string;
    category?: string;
    search?: string;
  };
}

export function CatalogFilters({ brands, currentFilters }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "");
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || "");
  const [inStock, setInStock] = useState(currentFilters.inStock === "true");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (currentFilters.category) params.set("category", currentFilters.category);
    if (currentFilters.search) params.set("search", currentFilters.search);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (inStock) params.set("inStock", "true");
    if (currentFilters.sortBy) params.set("sortBy", currentFilters.sortBy);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrand("");
    setInStock(false);
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentFilters.category) params.set("category", currentFilters.category);
      if (currentFilters.search) params.set("search", currentFilters.search);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-600 hover:underline"
        >
          Сбросить
        </button>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setInStock(!inStock)}
            className={`w-10 h-6 rounded-full relative transition-colors ${
              inStock ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                inStock ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">Только в наличии</span>
        </label>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Цена, ₽</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="От"
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="До"
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Бренд</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                value=""
                checked={selectedBrand === ""}
                onChange={() => setSelectedBrand("")}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Все бренды</span>
            </label>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={selectedBrand === brand}
                  onChange={() => setSelectedBrand(brand)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={applyFilters}
        disabled={isPending}
        className="w-full h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {isPending ? "Применяем..." : "Применить фильтры"}
      </button>
    </div>
  );
}
