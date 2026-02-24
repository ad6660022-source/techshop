"use client";

import { useState } from "react";

interface Spec {
  id?: string;
  name: string;
  value: string;
  group: string;
}

interface Props {
  description: string;
  specs: Spec[];
}

export function ProductTabs({ description, specs }: Props) {
  const filteredSpecs = specs.filter((s) => s.name?.trim() && s.value?.trim());

  const specGroups = filteredSpecs.reduce((acc, spec) => {
    const group = spec.group || "Основные";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {} as Record<string, Spec[]>);

  const hasSpecs = filteredSpecs.length > 0;
  const [tab, setTab] = useState<"description" | "specs">("description");

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => setTab("description")}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            tab === "description"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px bg-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Описание
        </button>
        {hasSpecs && (
          <button
            onClick={() => setTab("specs")}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              tab === "specs"
                ? "text-blue-600 border-b-2 border-blue-600 -mb-px bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Характеристики
          </button>
        )}
      </div>

      <div className="p-6">
        {tab === "description" && (
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {description || "Описание не добавлено."}
          </p>
        )}

        {tab === "specs" && hasSpecs && (
          <div className="space-y-6">
            {Object.entries(specGroups).map(([group, groupSpecs]) => (
              <div key={group}>
                <h4 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  {group}
                </h4>
                <div className="space-y-1">
                  {groupSpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-500 w-1/2">{spec.name}</span>
                      <span className="text-sm font-medium text-gray-900 text-right w-1/2">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
